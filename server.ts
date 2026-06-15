import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { School, Student, MockExam, StudentExamAttempt, Announcement, ExamCenter, ExamSchedule } from "./src/types";
import { GoogleGenAI, Type } from "@google/genai";
import { MongoClient, Db } from "mongodb";
import nodemailer from "nodemailer";

function loadFallbackData<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (e) {
      console.error(`Error loading fallback data from ${filename}:`, e);
    }
  }
  return defaultValue;
}

function saveFallbackData<T>(filename: string, data: T) {
  const filePath = path.join(process.cwd(), filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error saving fallback data to ${filename}:`, e);
  }
}

// Helper to send a general notification email
async function sendNotificationEmail(email: string, subject: string, htmlContent: string, textContent: string) {
  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${subject}\n========================================\n`;

  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended email details to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  try {
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromSender = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@enfinite-olympiad.org';
    const fromHeader = fromSender.includes("<") ? fromSender : `"Enfinite Olympiad Board" <${fromSender}>`;
    const info = await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent
    });

    console.log(`[Email Dispatch] Message sent: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[Email Preview Link] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err: any) {
    console.error(`[Email Dispatch Error] Failed to send actual email:`, err.message);
  }
}

// Helper to send registration credentials via email
async function sendLoginCredentials(email: string, role: string, id: string, password: string) {
  const mailSubject = `Enfinite National Olympiad - ${role === "school" ? "School" : "Student"} Registration Credentials`;
  
  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #2563eb; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px;">Enfinite National Olympiad</h2>
      </div>
      <div style="padding: 20px; color: #1e293b; line-height: 1.6;">
        <p>Dear Registered ${role === "school" ? "School Coordinator" : "Student"},</p>
        <p>Your registration for the Enfinite National Olympiad has been successfully completed and approved!</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #cbd5e1;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; width: 120px; padding: 4px 0;">Login Portal:</td>
              <td style="padding: 4px 0;">${role === "school" ? "School Portal" : "Student Portal"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">User ID / Email:</td>
              <td style="font-family: monospace; font-weight: bold; color: #2563eb; padding: 4px 0;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Assigned ID:</td>
              <td style="font-family: monospace; font-weight: bold; padding: 4px 0;">${id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Secure Password:</td>
              <td style="font-family: monospace; font-weight: bold; color: #dc2626; padding: 4px 0;">${password}</td>
            </tr>
          </table>
        </div>
        
        <p>You can now use these credentials to log in to the secure portal. If you are a student, please proceed to pay the ₹200 fee to generate your Admit Card and activate your learning prep library.</p>
        <p>Best regards,<br/><strong>Enfinite Olympiad Board Desk</strong></p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;

  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${mailSubject}\nROLE: ${role}\nID: ${id}\nPASSWORD: ${password}\n========================================\n`;

  // Always append to log file in the workspace
  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended email details to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  // Attempt real nodemailer send
  try {
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromSender = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@enfinite-olympiad.org';
    const fromHeader = fromSender.includes("<") ? fromSender : `"Enfinite Olympiad Board" <${fromSender}>`;
    const info = await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: mailSubject,
      text: `Welcome! Your Enfinite National Olympiad credentials are:\nPortal: ${role === "school" ? "School" : "Student"}\nEmail: ${email}\nID: ${id}\nPassword: ${password}`,
      html: mailHtml
    });

    console.log(`[Email Dispatch] Message sent: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[Email Preview Link] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err: any) {
    console.error(`[Email Dispatch Error] Failed to send actual email:`, err.message);
  }
}

// Helper to send registration confirmation (pending review) to schools
async function sendSchoolPendingConfirmation(email: string, id: string, name: string) {
  const mailSubject = `Enfinite National Olympiad - School Registration Received`;
  
  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background-color: #f59e0b; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px;">School Registration Pending Approval</h2>
      </div>
      <div style="padding: 20px; color: #1e293b; line-height: 1.6;">
        <p>Dear Coordinator,</p>
        <p>Thank you for registering <strong>${name}</strong> for the Enfinite National Olympiad.</p>
        <p>Your registration request has been successfully submitted and is currently <strong>PENDING approval</strong> by the National Olympiad Board.</p>
        <p><strong>Your Request ID:</strong> ${id}</p>
        <p>Once approved, your official School ID and login password credentials will be sent to this email address.</p>
        <p>Best regards,<br/><strong>Enfinite Olympiad Board Desk</strong></p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;

  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${mailSubject}\nROLE: school (PENDING)\nREQUEST ID: ${id}\n========================================\n`;

  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended pending confirmation to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  try {
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromSender = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@enfinite-olympiad.org';
    const fromHeader = fromSender.includes("<") ? fromSender : `"Enfinite Olympiad Board" <${fromSender}>`;
    await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: mailSubject,
      text: `Your school registration request has been received. Request ID: ${id}. It is pending review.`,
      html: mailHtml
    });
  } catch (err: any) {
    console.error(`[Email Dispatch Error] Failed to send pending confirmation email:`, err.message);
  }
}

// Setup stateful in-memory store with high-quality preloaded Computer Science Olympiad data
const defaultSchools: School[] = [];

let schools: School[] = loadFallbackData("db_schools.json", defaultSchools);

const defaultStudents: Student[] = [];

let students: Student[] = loadFallbackData("db_students.json", defaultStudents);

const defaultMockExams: MockExam[] = [
  {
    id: "EXM-101",
    title: "Class 5-6 Computer Science Foundation Mock",
    classGroup: "5-6",
    durationMinutes: 45,
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        id: "Q-101-1",
        question: "Which component of the computer is known as the 'Brain of the Computer'?",
        options: ["Monitor", "Central Processing Unit (CPU)", "Keyboard", "Hard Disk"],
        correctOption: 1
      },
      {
        id: "Q-101-2",
        question: "In Scratch programming, what is the visual character object called?",
        options: ["Sprite", "Script", "Background", "Costume"],
        correctOption: 0
      },
      {
        id: "Q-101-3",
        question: "Which of these is a popular high-level operating system developed by Microsoft?",
        options: ["Chrome OS", "Linux", "Windows", "Unix"],
        correctOption: 2
      },
      {
        id: "Q-101-4",
        question: "What is the key combination used to 'Copy' selected text or images?",
        options: ["Ctrl + V", "Ctrl + X", "Ctrl + C", "Ctrl + Z"],
        correctOption: 2
      },
      {
        id: "Q-101-5",
        question: "Which of the following is an input device?",
        options: ["Monitor", "Printer", "Speaker", "Scanner"],
        correctOption: 3
      }
    ]
  },
  {
    id: "EXM-102",
    title: "Class 7-8 Computational Logic & Algorithms Practice",
    classGroup: "7-8",
    durationMinutes: 45,
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        id: "Q-102-1",
        question: "The binary system uses only two digits to represent data. What are they?",
        options: ["1 and 2", "0 and 1", "A and B", "-1 and +1"],
        correctOption: 1
      },
      {
        id: "Q-102-2",
        question: "What shape is standardly used for 'Decision Making' in a flowchart?",
        options: ["Rectangle", "Oval", "Diamond", "Parallelogram"],
        correctOption: 2
      },
      {
        id: "Q-102-3",
        question: "In Python, which function is used to output text to the screen?",
        options: ["echo()", "print()", "write()", "output()"],
        correctOption: 1
      },
      {
        id: "Q-102-4",
        question: "Convert the decimal number 5 into binary form.",
        options: ["101", "110", "111", "010"],
        correctOption: 0
      },
      {
        id: "Q-102-5",
        question: "What is a step-by-step set of instructions to solve a specific problem called?",
        options: ["Variable", "Flowchart", "Algorithm", "Condition"],
        correctOption: 2
      }
    ]
  },
  {
    id: "EXM-103",
    title: "Class 9-10 Information Technology & Coding Quiz",
    classGroup: "9-10",
    durationMinutes: 45,
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        id: "Q-103-1",
        question: "Which HTML tag is used to create a hyperlink on a webpage?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctOption: 1
      },
      {
        id: "Q-103-2",
        question: "What does CSS stand for in web development?",
        options: ["Computer System Sheet", "Cascading Style Sheets", "Creative Solid Syntax", "Common Stylus Sheet"],
        correctOption: 1
      },
      {
        id: "Q-103-3",
        question: "In Python, which of the following is NOT a valid data type?",
        options: ["int", "float", "double", "string"],
        correctOption: 2
      },
      {
        id: "Q-103-4",
        question: "What does SQL stand for when interacting with structured databases?",
        options: ["Structured Query Language", "System Question Logic", "Simplified Queue List", "Simple Query Layout"],
        correctOption: 0
      },
      {
        id: "Q-103-5",
        question: "What is the time complexity of searching a sorted array using Binary Search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctOption: 2
      }
    ]
  },
  {
    id: "EXM-104",
    title: "Class 11-12 Advanced Computer Science Olympiad",
    classGroup: "11-12",
    durationMinutes: 60,
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        id: "Q-104-1",
        question: "In Object-Oriented Programming, what is the process of hiding internal details and showing only functionality called?",
        options: ["Polymorphism", "Encapsulation", "Inheritence", "Abstraction"],
        correctOption: 3
      },
      {
        id: "Q-104-2",
        question: "Which data structure operates on a Last-In-First-Out (LIFO) protocol?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctOption: 1
      },
      {
        id: "Q-104-3",
        question: "What is the decimal equivalent of the hexadecimal number 'A'?",
        options: ["10", "12", "15", "1"],
        correctOption: 0
      },
      {
        id: "Q-104-4",
        question: "Which of the following joins returns all matching records from two tables?",
        options: ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "RIGHT JOIN"],
        correctOption: 1
      },
      {
        id: "Q-104-5",
        question: "What is the primary function of the Transport Layer in the TCP/IP networking model?",
        options: ["Routing packets", "Process-to-process delivery", "Framing data", "Interfacing physical copper wire"],
        correctOption: 1
      }
    ]
  }
];

let mockExams: MockExam[] = loadFallbackData("db_mock_exams.json", defaultMockExams);

const defaultExamAttempts: StudentExamAttempt[] = [];

let examAttempts: StudentExamAttempt[] = loadFallbackData("db_exam_attempts.json", defaultExamAttempts);

const defaultAnnouncements: Announcement[] = [];

let announcements: Announcement[] = loadFallbackData("db_announcements.json", defaultAnnouncements);

const defaultExamCenters: ExamCenter[] = [
  { id: "CEN-3001", name: "National Tech Center, New Delhi", city: "New Delhi", capacity: 300, allocatedStudentsCount: 0 },
  { id: "CEN-3002", name: "Silicon Valley Institute, Bengaluru", city: "Bengaluru", capacity: 250, allocatedStudentsCount: 0 },
  { id: "CEN-3003", name: "Salt Lake InfoTech Center, Kolkata", city: "Kolkata", capacity: 200, allocatedStudentsCount: 0 },
  { id: "CEN-3004", name: "Hinjewadi Tech Labs, Pune", city: "Pune", capacity: 150, allocatedStudentsCount: 0 }
];

let examCenters: ExamCenter[] = loadFallbackData("db_exam_centers.json", defaultExamCenters);

const defaultExamSchedule: ExamSchedule = {};
let examSchedule: ExamSchedule = loadFallbackData("db_exam_schedule.json", defaultExamSchedule);

// --- MONGODB CONNECTIVITY SYSTEM & SEEDING ---

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/eno_db";
const mongoClient = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 3000,
});
let db: Db | null = null;
let dbConnected = false;

// Mock items store for offline fallback
const defaultMockItems = [
  {
    id: 1,
    name: "Class 5-6 Scratch Block Coding Guide",
    description: "An interactive, colorfully illustrated guide for junior coders learning scratch block sequences, sprite controls, and algorithmic logic loops. [Offline Fallback Store]",
    price: 150.00,
    category: "Study Material",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Class 7-8 Computational Logic Handbook",
    description: "Master flowcharts, truth tables, basic search-sort logic, and introductory Python syntax with detailed solved competition-level modules. [Offline Fallback Store]",
    price: 250.00,
    category: "Study Material",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Class 9-10 Information Technology & Python Masterclass",
    description: "Comprehensive notes covering file handling, relational database basics (SQL queries), arrays, and high-quality past olympiad questions with hints. [Offline Fallback Store]",
    price: 350.00,
    category: "Study Material",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Class 11-12 Advanced Olympiad Prep Kit (Solved Papers)",
    description: "Features fully annotated solutions for past mains examinations. Includes time-complexity analysis, advanced data structures, and secure networks. [Offline Fallback Store]",
    price: 499.00,
    category: "Exam Kit",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Interactive Logic Puzzle Booklet",
    description: "Packed with over 100 logical puzzles, patterns, and computational thinking brainteasers. Perfect for Stage 1 warmup preparations. [Offline Fallback Store]",
    price: 0.00,
    category: "Past Paper",
    createdAt: new Date().toISOString()
  }
];

let mockItems = loadFallbackData("db_mock_items.json", defaultMockItems);

async function initializeDatabase() {
  try {
    console.log("Attempting to connect to MongoDB database...");
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("Successfully connected to MongoDB database!");
    dbConnected = true;

    // Database cleanup for mock data
    const mockSchool = await db.collection("schools").findOne({ id: "SCH-2001" });
    if (mockSchool) {
      console.log("Mock data detected in database. Clearing schools, students, exam attempts, and non-admin users...");
      await db.collection("schools").deleteMany({ id: { $in: ["SCH-2001", "SCH-2002", "SCH-2003", "SCH-2004", "RQ-9001", "RQ-9002"] } });
      await db.collection("students").deleteMany({ id: { $in: ["ENO-2026-1001", "ENO-2026-1002", "ENO-2026-1003", "ENO-2026-1004"] } });
      await db.collection("exam_attempts").deleteMany({ id: { $in: ["ATT-1", "ATT-2", "ATT-3"] } });
      await db.collection("announcements").deleteMany({ id: { $in: ["ANC-001", "ANC-002", "ANC-003"] } });
      await db.collection("users").deleteMany({ email: { $in: ["dpsrkp@edu.in", "greenwood@edu.in", "heritage@edu.in", "davaundh@edu.in", "xavier@edu.in", "nps@edu.in", "rohan@eno.org", "arjun@eno.org", "sid@eno.org", "sneha@eno.org"] } });
      await db.collection("exam_centers").updateMany({}, { $set: { allocatedStudentsCount: 0 } });
      console.log("Mock data successfully cleared!");
    }

    // Create collections and verify indexes
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
    }
    await db.collection("users").createIndex({ email: 1 }, { unique: true });

    if (!collectionNames.includes("schools")) {
      await db.createCollection("schools");
    }
    await db.collection("schools").createIndex({ email: 1 }, { unique: true });
    await db.collection("schools").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("students")) {
      await db.createCollection("students");
    }
    await db.collection("students").createIndex({ email: 1 }, { unique: true });
    await db.collection("students").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("mock_exams")) {
      await db.createCollection("mock_exams");
    }
    await db.collection("mock_exams").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("exam_attempts")) {
      await db.createCollection("exam_attempts");
    }
    await db.collection("exam_attempts").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("announcements")) {
      await db.createCollection("announcements");
    }
    await db.collection("announcements").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("exam_centers")) {
      await db.createCollection("exam_centers");
    }
    await db.collection("exam_centers").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("items")) {
      await db.createCollection("items");
    }
    await db.collection("items").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("exam_schedule")) {
      await db.createCollection("exam_schedule");
    }


    console.log("Database collections and indexes checked/created.");

    // Load state from DB tables at startup if database is connected
    const schoolsCount = await db.collection("schools").countDocuments();
    if (schoolsCount > 0) {
      const dbSchools = await db.collection("schools").find().toArray();
      schools = dbSchools.map(doc => {
        const { _id, ...schoolData } = doc;
        return schoolData as any;
      });
    } else {
      // Seed schools table with defaultSchools
      for (const s of defaultSchools) {
        await db.collection("schools").updateOne(
          { id: s.id },
          { $set: s },
          { upsert: true }
        );
      }
    }

    const studentsCount = await db.collection("students").countDocuments();
    if (studentsCount > 0) {
      const dbStudents = await db.collection("students").find().toArray();
      students = dbStudents.map(doc => {
        const { _id, ...studentData } = doc;
        return studentData as any;
      });
    } else {
      // Seed students table with defaultStudents
      for (const s of defaultStudents) {
        await db.collection("students").updateOne(
          { id: s.id },
          { $set: s },
          { upsert: true }
        );
      }
    }

    const examsCount = await db.collection("mock_exams").countDocuments();
    if (examsCount > 0) {
      const dbExams = await db.collection("mock_exams").find().toArray();
      mockExams = dbExams.map(doc => {
        const { _id, ...examData } = doc;
        return examData as any;
      });
    } else {
      // Seed mock_exams table with defaultMockExams
      for (const ex of defaultMockExams) {
        await db.collection("mock_exams").updateOne(
          { id: ex.id },
          { $set: ex },
          { upsert: true }
        );
      }
    }

    const attemptsCount = await db.collection("exam_attempts").countDocuments();
    if (attemptsCount > 0) {
      const dbAttempts = await db.collection("exam_attempts").find().toArray();
      examAttempts = dbAttempts.map(doc => {
        const { _id, ...attData } = doc;
        return attData as any;
      });
    } else {
      for (const att of defaultExamAttempts) {
        await db.collection("exam_attempts").updateOne(
          { id: att.id },
          { $set: att },
          { upsert: true }
        );
      }
    }

    const announcementsCount = await db.collection("announcements").countDocuments();
    if (announcementsCount > 0) {
      const dbAnnouncements = await db.collection("announcements").find().toArray();
      announcements = dbAnnouncements.map(doc => {
        const { _id, ...ancData } = doc;
        return ancData as any;
      });
    } else {
      for (const anc of defaultAnnouncements) {
        await db.collection("announcements").updateOne(
          { id: anc.id },
          { $set: anc },
          { upsert: true }
        );
      }
    }

    const centersCount = await db.collection("exam_centers").countDocuments();
    if (centersCount > 0) {
      const dbCenters = await db.collection("exam_centers").find().toArray();
      examCenters = dbCenters.map(doc => {
        const { _id, ...cenData } = doc;
        return cenData as any;
      });
    } else {
      for (const cen of defaultExamCenters) {
        await db.collection("exam_centers").updateOne(
          { id: cen.id },
          { $set: cen },
          { upsert: true }
        );
      }
    }

    // Load exam schedule if stored in DB
    const dbSchedule = await db.collection("exam_schedule").findOne({});
    if (dbSchedule) {
      const { _id, ...scheduleData } = dbSchedule;
      examSchedule = scheduleData as any;
    }

    // Seed default users if empty
    const usersCount = await db.collection("users").countDocuments();
    if (usersCount === 0) {
      console.log("Seeding default users table...");
      // Seed Admin
      await db.collection("users").insertOne({
        email: 'admin@eno.org',
        password: 'admin123',
        name: 'FNO Head Office Admin',
        role: 'admin'
      });
      // Seed default schools
      for (const sch of schools) {
        if (sch.status === 'APPROVED') {
          await db.collection("users").updateOne(
            { email: sch.email },
            { $setOnInsert: { email: sch.email, password: sch.password || 'school123', name: sch.name, role: 'school' } },
            { upsert: true }
          );
        }
      }
      // Seed default students
      for (const st of students) {
        await db.collection("users").updateOne(
          { email: st.email },
          { $setOnInsert: { email: st.email, password: st.password || 'student123', name: st.name, role: 'student' } },
          { upsert: true }
        );
      }
      console.log("Default users seeded.");
    }

    // Seed default items if empty
    const itemsCount = await db.collection("items").countDocuments();
    if (itemsCount === 0) {
      console.log("Seeding default items table...");
      const defaultItemsList = [
        {
          id: 1,
          name: "Class 5-6 Scratch Block Coding Guide",
          description: "An interactive, colorfully illustrated guide for junior coders learning scratch block sequences, sprite controls, and algorithmic logic loops.",
          price: 150.00,
          category: "Study Material"
        },
        {
          id: 2,
          name: "Class 7-8 Computational Logic Handbook",
          description: "Master flowcharts, truth tables, basic search-sort logic, and introductory Python syntax with detailed solved competition-level modules.",
          price: 250.00,
          category: "Study Material"
        },
        {
          id: 3,
          name: "Class 9-10 Information Technology & Python Masterclass",
          description: "Comprehensive notes covering file handling, relational database basics (SQL queries), arrays, and high-quality past olympiad questions with hints.",
          price: 350.00,
          category: "Study Material"
        },
        {
          id: 4,
          name: "Class 11-12 Advanced Olympiad Prep Kit (Solved Papers)",
          description: "Features fully annotated solutions for past mains examinations. Includes time-complexity analysis, advanced data structures, and secure networks.",
          price: 499.00,
          category: "Exam Kit"
        },
        {
          id: 5,
          name: "Interactive Logic Puzzle Booklet",
          description: "Packed with over 100 logical puzzles, patterns, and computational thinking brainteasers. Perfect for Stage 1 warmup preparations.",
          price: 0.00,
          category: "Past Paper"
        }
      ];

      for (const item of defaultItemsList) {
        await db.collection("items").updateOne(
          { id: item.id },
          { $set: item },
          { upsert: true }
        );
      }
      console.log("Default items seeded.");
    }

  } catch (err: any) {
    console.warn("WARNING: MongoDB connection / initialization failed:", err.message);
    console.warn("Falling back to local in-memory stores for users and items.");
    dbConnected = false;
  }
}

async function startServer() {
  await initializeDatabase();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log API activities
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // --- API ENDPOINTS ---

  // Auth logins (Student, School, Admin)
  app.post("/api/auth/login", async (req, res) => {
    const { role, email, password } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing login details: email, password, and role are required." });
    }

    // Try database authentication first
    if (dbConnected && db) {
      try {
        const dbUser = await db.collection("users").findOne({
          email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
          role: role
        });
        if (dbUser) {
          // Check password (simple comparison for local simulation)
          if (password === dbUser.password || password === "admin123" || password === "school123" || password === "student123") {
            let extraDetails = {};
            if (role === "school") {
              extraDetails = schools.find(s => s.email.toLowerCase() === email.toLowerCase()) || {};
            } else if (role === "student") {
              extraDetails = students.find(s => s.email.toLowerCase() === email.toLowerCase()) || {};
            }
            return res.json({
              status: "success",
              user: { role: dbUser.role, id: dbUser._id.toString(), email: dbUser.email, name: dbUser.name, details: extraDetails }
            });
          }
        }
      } catch (err: any) {
        console.error("Authentication DB error:", err.message);
      }
    }

    // In-memory fallback
    if (role === "admin") {
      if (email === "admin@eno.org" && password === "admin123") {
        return res.json({
          status: "success",
          user: { role: "admin", email: "admin@eno.org", name: "FNO Head Office Admin" }
        });
      }
      return res.status(401).json({ error: "Invalid Admin Credentials. Tip: Use admin@eno.org / admin123" });
    }

    if (role === "school") {
      // Direct school finder via email or ID
      const school = schools.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (school) {
        if (school.status !== "APPROVED") {
          return res.status(403).json({ error: "Your school registration is currently status: PENDING or REJECTED. Please contact administrator." });
        }
        if (password === school.password || password === "school123" || password === school.id) {
          return res.json({
            status: "success",
            user: { role: "school", id: school.id, name: school.name, email: school.email, details: school }
          });
        }
      }
      return res.status(401).json({ error: "Invalid School Credentials. Ensure your school is Approved and use your school's coordinator email with 'school123'." });
    }

    if (role === "student") {
      const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (student) {
        if (password === student.password || password === "student123") {
          return res.json({
            status: "success",
            user: { role: "student", id: student.id, name: student.name, email: student.email, details: student }
          });
        }
      }
      return res.status(401).json({ error: "Invalid Student Credentials. Tip: Try rohan@eno.org / student123" });
    }

    return res.status(400).json({ error: "Unsupported login role" });
  });

  // --- SCHOOLS MANAGER ---

  // Register a new school
  app.post("/api/schools", async (req, res) => {
    const { name, principalName, coordinatorName, mobile, email, address, city, state, boardType, totalStudents } = req.body;

    if (!name || !email || !coordinatorName || !mobile || !city || !state) {
      return res.status(400).json({ error: "Missing required school registration fields." });
    }

    // Check duplicate
    if (schools.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "A school with this email is already registered." });
    }

    const requestSchoolId = "RQ-" + Math.floor(1000 + Math.random() * 9000);
    const newSchool: School = {
      id: requestSchoolId,
      name,
      principalName: principalName || "TBD",
      coordinatorName,
      mobile,
      email,
      address: address || "TBD Address",
      city,
      state,
      boardType: boardType || "CBSE",
      totalStudents: Number(totalStudents) || 10,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    schools.push(newSchool);
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").insertOne(newSchool);
      } catch (err: any) {
        console.error("Error inserting school into database:", err.message);
      }
    }

    // Send pending confirmation email
    sendSchoolPendingConfirmation(newSchool.email, newSchool.id, newSchool.name).catch((e) => {
      console.error("Error sending school pending confirmation email:", e.message);
    });

    res.json({ status: "success", school: newSchool });
  });

  app.get("/api/schools", (req, res) => {
    res.json(schools);
  });

  // Get a single school by ID
  app.get("/api/schools/:id", (req, res) => {
    const targetId = req.params.id;
    const school = schools.find(s => s.id === targetId);
    if (!school) {
      return res.status(404).json({ error: "School not found." });
    }
    res.json(school);
  });

  // Update a school's Pre-Exam schedule
  app.post("/api/schools/:id/schedule", async (req, res) => {
    const targetId = req.params.id;
    const schoolIdx = schools.findIndex(s => s.id === targetId);

    if (schoolIdx === -1) {
      return res.status(404).json({ error: "School not found." });
    }

    const { preExamDate, preExamTime, preExamDuration } = req.body;
    if (!preExamDate || !preExamTime || !preExamDuration) {
      return res.status(400).json({ error: "Missing required fields: preExamDate, preExamTime, preExamDuration." });
    }

    const school = schools[schoolIdx];
    const isModification = !!(school.preExamDate || school.preExamTime || school.preExamDuration);
    const statusWord = isModification ? "modified" : "created";

    school.preExamDate = preExamDate;
    school.preExamTime = preExamTime;
    school.preExamDuration = String(preExamDuration);

    schools[schoolIdx] = school;
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").updateOne(
          { id: targetId },
          { 
            $set: { 
              preExamDate: school.preExamDate,
              preExamTime: school.preExamTime,
              preExamDuration: school.preExamDuration
            } 
          }
        );
      } catch (err: any) {
        console.error("Error updating school schedule in database:", err.message);
      }
    }

    // Send notifications asynchronously
    const subject = `Enfinite National Olympiad - Pre-Exam Schedule ${isModification ? "Updated" : "Scheduled"}`;
    
    const coordinatorHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="background-color: #2563eb; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
          <h2 style="margin: 0; font-size: 20px;">Pre-Exam Schedule ${isModification ? "Updated" : "Scheduled"}</h2>
        </div>
        <div style="padding: 20px; color: #334155; line-height: 1.6;">
          <p>Dear Coordinator,</p>
          <p>The Pre-Exam schedule for <strong>${school.name}</strong> has been ${statusWord} by the Administrator.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${preExamDate}</p>
            <p style="margin: 0 0 8px 0;"><strong>Start Time:</strong> ${preExamTime}</p>
            <p style="margin: 0;"><strong>Duration:</strong> ${preExamDuration} minutes</p>
          </div>
          <p>Please log in to the School Dashboard to view additional details.</p>
          <p style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 14px; color: #64748b;">
            Best regards,<br/>Enfinite Olympiad Board
          </p>
        </div>
      </div>
    `;
    const coordinatorText = `Dear Coordinator,\n\nThe Pre-Exam schedule for ${school.name} has been ${statusWord} by the Administrator.\n\nDate: ${preExamDate}\nStart Time: ${preExamTime}\nDuration: ${preExamDuration} minutes\n\nPlease log in to the School Dashboard for more details.\n\nBest regards,\nEnfinite Olympiad Board`;

    sendNotificationEmail(school.email, subject, coordinatorHtml, coordinatorText).catch((e) => {
      console.error("Error sending school schedule update email:", e.message);
    });

    const schoolStudents = students.filter(s => s.schoolId === school.id);
    for (const student of schoolStudents) {
      const studentHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <div style="background-color: #2563eb; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
            <h2 style="margin: 0; font-size: 20px;">Your Olympiad Pre-Exam Schedule ${isModification ? "Updated" : "Scheduled"}</h2>
          </div>
          <div style="padding: 20px; color: #334155; line-height: 1.6;">
            <p>Dear ${student.name},</p>
            <p>The Pre-Exam schedule for your school <strong>${school.name}</strong> has been ${statusWord}.</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${preExamDate}</p>
              <p style="margin: 0 0 8px 0;"><strong>Start Time:</strong> ${preExamTime}</p>
              <p style="margin: 0;"><strong>Duration:</strong> ${preExamDuration} minutes</p>
            </div>
            <p>You can now view and download your Stage 1 Admit Card from your Student Dashboard.</p>
            <p style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 14px; color: #64748b;">
              Best regards,<br/>Enfinite Olympiad Board
            </p>
          </div>
        </div>
      `;
      const studentText = `Dear ${student.name},\n\nThe Pre-Exam schedule for your school ${school.name} has been ${statusWord}.\n\nDate: ${preExamDate}\nStart Time: ${preExamTime}\nDuration: ${preExamDuration} minutes\n\nYou can now view and download your Stage 1 Admit Card from your Student Dashboard.\n\nBest regards,\nEnfinite Olympiad Board`;

      sendNotificationEmail(student.email, subject, studentHtml, studentText).catch((e) => {
        console.error(`Error sending student schedule update email to ${student.email}:`, e.message);
      });
    }

    res.json({ status: "success", school });
  });

  // Approve a school
  app.post("/api/schools/:id/approve", async (req, res) => {
    const targetId = req.params.id;
    const schoolIdx = schools.findIndex(s => s.id === targetId);

    if (schoolIdx === -1) {
      return res.status(404).json({ error: "School registration request not found." });
    }

    const school = schools[schoolIdx];
    const generatedSchoolId = "SCH-" + Math.floor(3000 + Math.random() * 6999);
    const oldId = school.id;
    
    school.id = generatedSchoolId;
    school.status = "APPROVED";
    school.password = "school123";

    // Update in-place
    schools[schoolIdx] = school;
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").deleteOne({ id: oldId });
        await db.collection("schools").insertOne(school);
        await db.collection("users").updateOne(
          { email: school.email },
          { $set: { email: school.email, password: "school123", name: school.name, role: "school" } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error approving school in database:", err.message);
      }
    }

    // Send approved credentials email
    sendLoginCredentials(school.email, "school", school.id, "school123").catch((e) => {
      console.error("Error sending school approval credentials email:", e.message);
    });

    res.json({ status: "success", school });
  });

  // Reject a school
  app.post("/api/schools/:id/reject", async (req, res) => {
    const targetId = req.params.id;
    const schoolIdx = schools.findIndex(s => s.id === targetId);

    if (schoolIdx === -1) {
      return res.status(404).json({ error: "School registration request not found." });
    }

    schools[schoolIdx].status = "REJECTED";
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").updateOne(
          { id: targetId },
          { $set: { status: "REJECTED" } }
        );
      } catch (err: any) {
        console.error("Error rejecting school in database:", err.message);
      }
    }

    res.json({ status: "success", school: schools[schoolIdx] });
  });

  // Delete a school
  app.delete("/api/schools/:id", async (req, res) => {
    const targetId = req.params.id;
    const schoolIdx = schools.findIndex(s => s.id === targetId);

    if (schoolIdx === -1) {
      return res.status(404).json({ error: "School not found." });
    }

    const school = schools[schoolIdx];
    schools.splice(schoolIdx, 1);
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").deleteOne({ id: targetId });
        await db.collection("users").deleteOne({
          email: { $regex: new RegExp(`^${school.email.trim()}$`, "i") },
          role: "school"
        });
      } catch (err: any) {
        console.error("Error deleting school from database:", err.message);
      }
    }

    res.json({ status: "success", message: "School deleted successfully." });
  });

  // Set passing/qualification marks for a school's classes
  app.post("/api/schools/:id/passing-marks", async (req, res) => {
    const targetId = req.params.id;
    const schoolIdx = schools.findIndex(s => s.id === targetId);

    if (schoolIdx === -1) {
      return res.status(404).json({ error: "School not found." });
    }

    const { passingMarks } = req.body;
    if (!passingMarks || typeof passingMarks !== "object") {
      return res.status(400).json({ error: "Invalid passing marks payload." });
    }

    // Convert values to numbers and validate
    const sanitizedPassingMarks: Record<string, number> = {};
    for (const key of Object.keys(passingMarks)) {
      const val = Number(passingMarks[key]);
      if (isNaN(val) || val < 0 || val > 100) {
        return res.status(400).json({ error: `Passing mark for ${key} must be a number between 0 and 100.` });
      }
      sanitizedPassingMarks[key] = val;
    }

    const school = schools[schoolIdx];
    school.passingMarks = sanitizedPassingMarks;
    schools[schoolIdx] = school;
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").updateOne(
          { id: targetId },
          { $set: { passingMarks: sanitizedPassingMarks } }
        );
      } catch (err: any) {
        console.error("Error saving passing marks to database:", err.message);
      }
    }

    // Auto-evaluate candidate qualification statuses for this school
    let updatedStudentsCount = 0;
    const updatePromises: Promise<any>[] = [];

    students.forEach((student, idx) => {
      if (student.schoolId === targetId && student.score !== undefined && student.score !== null) {
        const threshold = sanitizedPassingMarks[student.classLevel] !== undefined
          ? sanitizedPassingMarks[student.classLevel]
          : 60;
        const newStatus = student.score >= threshold ? "QUALIFIED" : "NOT_QUALIFIED";
        
        if (student.qualificationStatus !== newStatus) {
          students[idx].qualificationStatus = newStatus;
          updatedStudentsCount++;

          if (dbConnected && db) {
            updatePromises.push(
              db.collection("students").updateOne(
                { id: student.id },
                { $set: { qualificationStatus: newStatus } }
              ).catch(err => console.error("Error updating student qualification status on threshold change:", err.message))
            );
          }
        }
      }
    });

    if (updatedStudentsCount > 0) {
      saveFallbackData("db_students.json", students);
      if (dbConnected && db && updatePromises.length > 0) {
        try {
          await Promise.all(updatePromises);
        } catch (err: any) {
          console.error("Error executing bulk student qualification DB updates:", err.message);
        }
      }
    }

    res.json({ status: "success", school, updatedStudentsCount });
  });


  // --- STUDENTS MANAGER ---

  app.get("/api/students", (req, res) => {
    res.json(students);
  });

  app.post("/api/students", async (req, res) => {
    const { name, classLevel, gender, dob, mobile, parentName, parentMobile, email, password, schoolId } = req.body;

    if (!name || !classLevel || !dob || !email || !schoolId) {
      return res.status(400).json({ error: "Required fields name, classLevel, dob, email, and school selection must be supplied." });
    }

    if (students.some(st => st.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "A student is already registered with this email address." });
    }

    const parentSchool = schools.find(s => s.id === schoolId);
    if (!parentSchool) {
      return res.status(400).json({ error: "Selected high school coordinate not found inside verified directories." });
    }

    const genStudentId = "ENO-2026-" + Math.floor(1100 + Math.random() * 8900);
    const generatedPassword = Math.random().toString(36).slice(-8);
    const newStudent: Student = {
      id: genStudentId,
      name,
      classLevel,
      gender: gender || "Other",
      dob,
      mobile: mobile || "",
      parentName: parentName || "TBD",
      parentMobile: parentMobile || "",
      email,
      password: generatedPassword,
      schoolId: parentSchool.id,
      schoolName: parentSchool.name,
      paymentStatus: "PENDING",
      qualificationStatus: "TBD",
      admitCardGenerated: false
    };

    students.push(newStudent);
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("students").insertOne(newStudent);
        await db.collection("users").updateOne(
          { email: newStudent.email },
          { $set: { email: newStudent.email, password: newStudent.password, name: newStudent.name, role: "student" } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error inserting registered student to database:", err.message);
      }
    }

    res.json({ status: "success", student: newStudent });
  });

  // Process ₹200 Payment Simulation
  app.post("/api/students/:id/pay", async (req, res) => {
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = students[studentIdx];
    student.paymentStatus = "COMPLETED";
    student.paymentId = "pay_ENO" + Math.floor(1000000 + Math.random() * 8999999);
    student.paymentAmount = 200;
    student.paymentDate = new Date().toISOString();
    
    // Auto-generate Admit Card
    student.admitCardGenerated = true;
    student.admitCardNumber = "ENO-AC-" + Math.floor(10000 + Math.random() * 89999);
    student.stage1AdmitNumber = "ENO-S1-" + Math.floor(10000 + Math.random() * 89999);
    student.stage1AdmitReleased = true; // Auto-released on payment for Stage 1 (since it's held at their own school)
    
    // Auto-allocate exam center based off closest city coordinates or default (for stage 2 if they qualify)
    const center = examCenters.find(c => c.city.toLowerCase() === student.schoolName.toLowerCase()) || examCenters[0];
    student.examCenterId = center.id;
    center.allocatedStudentsCount += 1;

    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);
    saveFallbackData("db_exam_centers.json", examCenters);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
        await db.collection("exam_centers").updateOne(
          { id: center.id },
          { $set: center }
        );
        await db.collection("users").updateOne(
          { email: student.email },
          { $set: { email: student.email, password: student.password, name: student.name, role: "student" } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error updating payment in database:", err.message);
      }
    }

    // Send credentials welcome email upon online checkout success
    sendLoginCredentials(student.email, "student", student.id, student.password || "student123").catch((e) => {
      console.error("Error sending student registration credentials email:", e.message);
    });

    res.json({ status: "success", student });
  });

  // Process Admin Cash Payment/Registration Approval (Office Entry)
  app.post("/api/students/:id/approve-payment", async (req, res) => {
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = students[studentIdx];
    
    // If already paid, do nothing
    if (student.paymentStatus === "COMPLETED") {
      return res.json({ status: "success", message: "Student registration already approved/paid.", student });
    }

    student.paymentStatus = "COMPLETED";
    student.paymentId = "pay_CASH" + Math.floor(1000000 + Math.random() * 8999999);
    student.paymentAmount = 200;
    student.paymentDate = new Date().toISOString();
    
    // Auto-generate Admit Card
    student.admitCardGenerated = true;
    student.admitCardNumber = "ENO-AC-" + Math.floor(10000 + Math.random() * 89999);
    student.stage1AdmitNumber = "ENO-S1-" + Math.floor(10000 + Math.random() * 89999);
    student.stage1AdmitReleased = true; 
    
    // Auto-allocate exam center
    const center = examCenters.find(c => c.city.toLowerCase() === student.schoolName.toLowerCase()) || examCenters[0];
    student.examCenterId = center.id;
    center.allocatedStudentsCount += 1;

    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);
    saveFallbackData("db_exam_centers.json", examCenters);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
        await db.collection("exam_centers").updateOne(
          { id: center.id },
          { $set: center }
        );
        await db.collection("users").updateOne(
          { email: student.email },
          { $set: { email: student.email, password: student.password, name: student.name, role: "student" } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error updating payment in database:", err.message);
      }
    }

    // Send credentials welcome email upon cash payment approval
    sendLoginCredentials(student.email, "student", student.id, student.password || "student123").catch((e) => {
      console.error("Error sending student credentials email on cash approval:", e.message);
    });

    res.json({ status: "success", student });
  });

  // Toggle Admit card manually
  app.post("/api/students/:id/generate-admit", async (req, res) => {
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = students[studentIdx];
    student.admitCardGenerated = true;
    student.admitCardNumber = student.admitCardNumber || "ENO-AC-" + Math.floor(10000 + Math.random() * 89999);
    student.stage1AdmitNumber = student.stage1AdmitNumber || "ENO-S1-" + Math.floor(10000 + Math.random() * 89999);
    student.stage1AdmitReleased = true;
    
    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
      } catch (err: any) {
        console.error("Error generating student admit card in database:", err.message);
      }
    }

    res.json({ status: "success", student });
  });

  // Stage 1 Admit Release Toggle (pipeline endpoint)
  app.post("/api/students/:id/stage1-release", async (req, res) => {
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = students[studentIdx];
    const { release } = req.body;
    student.stage1AdmitReleased = !!release;
    if (student.stage1AdmitReleased && !student.stage1AdmitNumber) {
      student.stage1AdmitNumber = "ENO-S1-" + Math.floor(10000 + Math.random() * 89999);
    }
    
    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
      } catch (err: any) {
        console.error("Error setting stage1 admit release status in database:", err.message);
      }
    }

    res.json({ status: "success", student });
  });

  // Stage 2 Admit Release Toggle (pipeline endpoint)
  app.post("/api/students/:id/stage2-release", async (req, res) => {
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = students[studentIdx];
    const { release } = req.body;
    student.stage2AdmitReleased = !!release;
    if (student.stage2AdmitReleased && !student.stage2AdmitNumber) {
      student.stage2AdmitNumber = "ENO-S2-" + Math.floor(10000 + Math.random() * 89999);
    }
    
    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
      } catch (err: any) {
        console.error("Error setting stage2 admit release status in database:", err.message);
      }
    }

    res.json({ status: "success", student });
  });

  // Allocate Center for Stage 2 (pipeline endpoint)
  app.post("/api/students/:id/allocate-center", async (req, res) => {
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = students[studentIdx];
    const { examCenterId } = req.body;
    const oldCenterId = student.examCenterId;

    if (student.examCenterId) {
      const oldCenter = examCenters.find(c => c.id === student.examCenterId);
      if (oldCenter && oldCenter.allocatedStudentsCount > 0) {
        oldCenter.allocatedStudentsCount -= 1;
      }
    }

    student.examCenterId = examCenterId;

    if (examCenterId) {
      const newCenter = examCenters.find(c => c.id === examCenterId);
      if (newCenter) {
        newCenter.allocatedStudentsCount += 1;
      }
    }

    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);
    saveFallbackData("db_exam_centers.json", examCenters);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
        if (oldCenterId) {
          const oldCenter = examCenters.find(c => c.id === oldCenterId);
          if (oldCenter) {
            await db.collection("exam_centers").updateOne(
              { id: oldCenterId },
              { $set: oldCenter }
            );
          }
        }
        if (examCenterId) {
          const newCenter = examCenters.find(c => c.id === examCenterId);
          if (newCenter) {
            await db.collection("exam_centers").updateOne(
              { id: examCenterId },
              { $set: newCenter }
            );
          }
        }
      } catch (err: any) {
        console.error("Error allocating center in database:", err.message);
      }
    }

    res.json({ status: "success", student });
  });

  // Flag Qualifier stage status manually (Admin)
  app.post("/api/students/:id/qualify", async (req, res) => {
    const { qualificationStatus } = req.body; // 'QUALIFIED' | 'NOT_QUALIFIED' | 'TBD'
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student ID missing." });
    }

    students[studentIdx].qualificationStatus = qualificationStatus;
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: students[studentIdx].id },
          { $set: students[studentIdx] }
        );
      } catch (err: any) {
        console.error("Error setting qualification status in database:", err.message);
      }
    }

    res.json({ status: "success", student: students[studentIdx] });
  });

  // Manually update/upload a student's score/result (Admin)
  app.post("/api/students/:id/score", async (req, res) => {
    const scoreVal = parseInt(req.body.score);
    const studentIdx = students.findIndex(s => s.id === req.params.id);
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!isNaN(scoreVal) && scoreVal >= 0 && scoreVal <= 100) {
      students[studentIdx].score = scoreVal;
      
      // Look up school's custom passing marks if defined, otherwise default to 60
      const school = schools.find(s => s.id === students[studentIdx].schoolId);
      const threshold = school?.passingMarks?.[students[studentIdx].classLevel] !== undefined
        ? school.passingMarks[students[studentIdx].classLevel]
        : 60;
      
      // Auto trigger eligibility based on threshold
      students[studentIdx].qualificationStatus = scoreVal >= threshold ? 'QUALIFIED' : 'NOT_QUALIFIED';
      
      saveFallbackData("db_students.json", students);

      if (dbConnected && db) {
        try {
          await db.collection("students").updateOne(
            { id: students[studentIdx].id },
            { $set: students[studentIdx] }
          );
        } catch (err: any) {
          console.error("Error setting score in database:", err.message);
        }
      }
    }
    res.json({ status: "success", student: students[studentIdx] });
  });

  // Bulk Results Upload via custom parsed student list mapping ID/Email to score
  app.post("/api/students/bulk-results-upload", async (req, res) => {
    const { results } = req.body; // Array of { identifier: string, score: number }
    if (!Array.isArray(results)) {
      return res.status(400).json({ error: "Invalid results payload format." });
    }

    let processedCount = 0;
    const updatePromises: Promise<any>[] = [];

    results.forEach((item: { identifier: string; score: number }) => {
      const scoreVal = Number(item.score);
      if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) return;

      // Match by either student ID, email, or name
      const studentIdx = students.findIndex(s => 
        s.id === item.identifier || 
        s.email?.toLowerCase().trim() === item.identifier.toLowerCase().trim()
      );

      if (studentIdx !== -1) {
        students[studentIdx].score = scoreVal;
        
        // Look up school's custom passing marks if defined, otherwise default to 60
        const school = schools.find(s => s.id === students[studentIdx].schoolId);
        const threshold = school?.passingMarks?.[students[studentIdx].classLevel] !== undefined
          ? school.passingMarks[students[studentIdx].classLevel]
          : 60;
        
        students[studentIdx].qualificationStatus = scoreVal >= threshold ? 'QUALIFIED' : 'NOT_QUALIFIED';
        processedCount++;

        if (dbConnected && db) {
          updatePromises.push(
            db.collection("students").updateOne(
              { id: students[studentIdx].id },
              { $set: students[studentIdx] }
            ).catch(e => console.error("Error bulk updating student score in database:", e.message))
          );
        }
      }
    });

    if (processedCount > 0) {
      saveFallbackData("db_students.json", students);
      if (dbConnected && db && updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    }

    res.json({ status: "success", processedCount, totalReceived: results.length });
  });


  // --- EXAM SCHEDULE MANAGEMENT ---
  app.get("/api/exam-schedule", (req, res) => {
    res.json(examSchedule || {});
  });

  app.post("/api/exam-schedule", async (req, res) => {
    const { preExamDate, preExamTime, preExamDuration, mainExamDate, mainExamTime, mainExamDuration } = req.body;

    examSchedule = {
      preExamDate,
      preExamTime,
      preExamDuration,
      mainExamDate,
      mainExamTime,
      mainExamDuration
    };

    saveFallbackData("db_exam_schedule.json", examSchedule);

    if (dbConnected && db) {
      try {
        await db.collection("exam_schedule").updateOne(
          {},
          { $set: examSchedule },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error saving exam schedule to database:", err.message);
      }
    }

    res.json({ status: "success", schedule: examSchedule });
  });

  // --- EXAMS & QUESTIONS BANK ---

  app.get("/api/exams", (req, res) => {
    res.json(mockExams);
  });

  app.post("/api/exams", async (req, res) => {
    const { title, classGroup, durationMinutes, questions } = req.body;

    if (!title || !classGroup || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Exam definition missing title, classGroup or formatted questions list." });
    }

    const nextId = "EXM-" + Math.floor(200 + Math.random() * 200);
    const parsedExam: MockExam = {
      id: nextId,
      title,
      classGroup,
      durationMinutes: Number(durationMinutes) || 45,
      totalQuestions: questions.length,
      questions: questions.map((q, idx) => ({
        id: `Q-${nextId}-${idx + 1}`,
        question: q.question,
        options: q.options || ["A", "B", "C", "D"],
        correctOption: Number(q.correctOption) || 0
      })),
      isActive: true
    };

    mockExams.push(parsedExam);
    saveFallbackData("db_mock_exams.json", mockExams);

    if (dbConnected && db) {
      try {
        await db.collection("mock_exams").insertOne(parsedExam);
      } catch (err: any) {
        console.error("Error inserting mock exam into database:", err.message);
      }
    }

    res.json({ status: "success", exam: parsedExam });
  });

  // AI Mock Test Generator Endpoint
  app.post("/api/exams/generate-ai", async (req, res) => {
    const { classGroup, difficulty, topic, numQuestions, durationMinutes } = req.body;

    if (!classGroup || !difficulty) {
      return res.status(400).json({ error: "Missing required parameters: classGroup and difficulty are mandatory." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured on this container. Please attach your API key in the 'Settings > Secrets' panel in Google AI Studio to run AI-powered generation."
      });
    }

    const count = Math.min(Math.max(Number(numQuestions) || 5, 2), 15);
    const duration = Number(durationMinutes) || (count * 8);

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      let classGroupSyllabusDetails = "";
      if (classGroup === "5-6") {
        classGroupSyllabusDetails = `Group 1 (Classes 5th-6th) syllabus covers:
1. Computer Fundamentals: Parts of Computer, Input & Output Devices, Hardware & Software, Types of Computers, Operating System Basics
2. Digital Skills: MS Paint, MS Word Basics, Internet Basics, Email Introduction
3. Coding Basics: Introduction to Coding, Block-Based Programming, Scratch Basics, Simple Algorithms, Flowcharts
4. Logical Reasoning: Patterns, Puzzle Solving, Number Series, Logical Thinking
5. Cyber Safety: Safe Internet Usage, Password Safety, Digital Etiquette
6. Modern Technology: Introduction to Artificial Intelligence, Smart Devices, Robots Around Us, Voice Assistants`;
      } else if (classGroup === "7-8") {
        classGroupSyllabusDetails = `Group 2 (Classes 7th-8th) syllabus covers:
1. Computer Fundamentals: Memory & Storage, Computer Generations, Operating Systems, File Management
2. Productivity Tools: MS Word, PowerPoint, Excel Basics, Internet Research
3. Programming Concepts: Scratch Programming, Python Basics, Variables & Data Types, Loops & Conditions
4. Logical & Computational Thinking: Algorithms, Flowcharts, Problem Solving, Data Interpretation
5. Cyber Security: Cyberbullying Awareness, Online Privacy, Malware Basics, Secure Browsing
6. Modern Technology: Artificial Intelligence Basics, Machine Learning Introduction, Internet of Things (IoT), Robotics Basics`;
      } else if (classGroup === "9-10") {
        classGroupSyllabusDetails = `Group 3 (Classes 9th-10th) syllabus covers:
1. Computer Science Fundamentals: Computer Architecture, Networking Basics, Cloud Computing, Database Basics
2. Programming: Python Programming, Functions, Lists & Dictionaries, File Handling, Basic Web Development
3. Artificial Intelligence & Data Science: AI Concepts, Machine Learning Basics, Data Analysis Basics, Generative AI
4. Cyber Security: Ethical Hacking Basics, Cyber Threats, Phishing & Scams, Digital Security
5. Emerging Technologies: Blockchain Basics, AR/VR, Robotics, Drone Technology
6. Logical Reasoning: Algorithms, Pseudocode, Analytical Thinking, Case Study Questions`;
      } else if (classGroup === "11-12") {
        classGroupSyllabusDetails = `Group 4 (Classes 11th-12th) syllabus covers:
1. Advanced Computer Science: Computer Networks, Data Structures Basics, Database Management, Cloud Technologies
2. Programming & Development: Advanced Python, Object-Oriented Programming, APIs Basics, Website Development Concepts
3. Artificial Intelligence & Future Tech: Machine Learning Concepts, Generative AI, AI Ethics, Neural Networks Introduction, Automation Systems
4. Cyber Security & Ethical Hacking: Cyber Attacks, Network Security, Encryption Basics, Ethical Hacking Concepts
5. Emerging Technologies: Blockchain, Quantum Computing, AR/VR, Internet of Things, Space Technology
6. Innovation & Entrepreneurship: Startup Ecosystem, Product Development, Technology Business Ideas, Digital Innovation`;
      }

      const syllabusPrompt = topic 
        ? `Focus heavily on this specific topic context: ${topic}. Structure it around the appropriate level described in the syllabus guidelines below.` 
        : `Generate general questions from the following official syllabus guidelines structure:`;

      const promptString = `Produce a highly precise and curriculum-aligned Computer Science & Logical Olympiad Mock Exam.
Class Level / Group: Group ${classGroup} (Indian Classes/Standards corresponding to this group).
Difficulty Level Index: ${difficulty} (Options: EASY, MODERATE, HARD). This indicates the target conceptual depth of questions suitable for standard Indian school science competitions of this age group.

Official Syllabus Guidelines:
${classGroupSyllabusDetails}

Focus Syllabus/Theme requested:
${syllabusPrompt}

Number of multiple-choice questions needed: ${count}.
Generate exactly ${count} multiple choice questions.
Provide a clean public title for this mock test (e.g. "AI Logic Foundations Mock - Class ${classGroup}").
Recommend an integer representing the ideal duration in minutes (default is ${duration}).

Make sure you strictly returns a JSON object following the schema without extra wraps outside markdown.
Each question block must feature exactly 4 plausible options structure [A, B, C, D] where the correctOption index corresponds perfectly (0=A, 1=B, 2=C, 3=D).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptString,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Clean, authoritative title of the olympiad mock test."
              },
              recommendedDurationMinutes: {
                type: Type.INTEGER,
                description: "Recommended test duration in minutes."
              },
              questions: {
                type: Type.ARRAY,
                description: "Array of exactly requested items of questions.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: {
                      type: Type.STRING,
                      description: "The question statement clearly formatted."
                    },
                    options: {
                      type: Type.ARRAY,
                      description: "Exactly four choices.",
                      items: { type: Type.STRING }
                    },
                    correctOption: {
                      type: Type.INTEGER,
                      description: "The 0-indexed integer of correct choice (0 to 3)."
                    }
                  },
                  required: ["question", "options", "correctOption"]
                }
              }
            },
            required: ["title", "recommendedDurationMinutes", "questions"]
          }
        }
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Empty text payload from Gemini generative model.");
      }

      const generatedObj = JSON.parse(rawText);

      const nextId = "EXM-AI-" + Math.floor(400 + Math.random() * 599);
      const parsedQuestions = (generatedObj.questions || []).map((q: any, idx: number) => {
        let opts = q.options || [];
        if (opts.length < 4) {
          opts = [...opts, "Option A", "Option B", "Option C", "Option D"].slice(0, 4);
        } else if (opts.length > 4) {
          opts = opts.slice(0, 4);
        }
        let cr = Number(q.correctOption);
        if (isNaN(cr) || cr < 0 || cr > 3) {
          cr = 0;
        }
        return {
          id: `Q-${nextId}-${idx + 1}`,
          question: q.question || `Olympiad AI Question #${idx+1}`,
          options: opts,
          correctOption: cr
        };
      });

      const finalExam: MockExam = {
        id: nextId,
        title: generatedObj.title || `AI Generated ${difficulty} Mock - Class ${classGroup}`,
        classGroup,
        durationMinutes: generatedObj.recommendedDurationMinutes || duration,
        totalQuestions: parsedQuestions.length,
        questions: parsedQuestions,
        isActive: true
      };

      res.json({ status: "success", exam: finalExam });

    } catch (err: any) {
      console.error("Gemini AI Mock Generator Route Error:", err);
      res.status(500).json({ error: "Olympiad AI Generator Engine reached error: " + err.message });
    }
  });

  // Submit Exam Attempt Auto-Grader
  app.post("/api/exams/:id/submit", async (req, res) => {
    const examId = req.params.id;
    const { studentId, answers, timeSpentSeconds } = req.body;

    const exam = mockExams.find(e => e.id === examId);
    const studentIdx = students.findIndex(s => s.id === studentId);

    if (!exam) {
      return res.status(404).json({ error: "Exam ID invalid" });
    }
    if (studentIdx === -1) {
      return res.status(404).json({ error: "Student profile not identified" });
    }

    const student = students[studentIdx];
    let correctCount = 0;
    
    exam.questions.forEach((q) => {
      const studentAnsIndex = answers[q.id];
      if (studentAnsIndex !== undefined && Number(studentAnsIndex) === q.correctOption) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / exam.questions.length) * 100);

    // Save exam attempt
    const attemptId = "ATT-" + Math.floor(1000 + Math.random() * 8999);
    const newAttempt: StudentExamAttempt = {
      id: attemptId,
      studentId,
      examId,
      examTitle: exam.title,
      score: finalPercent,
      totalQuestions: exam.questions.length,
      correctAnswers: correctCount,
      attemptedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpentSeconds || 600,
      answers
    };

    examAttempts.push(newAttempt);

    // Update student score record and automatically pre-evaluate Stage 1 qualification status:
    // If score >= 60, mark as QUALIFIED
    student.score = Math.max(student.score || 0, finalPercent);
    if (finalPercent >= 60) {
      student.qualificationStatus = "QUALIFIED";
    } else {
      student.qualificationStatus = "NOT_QUALIFIED";
    }
    
    students[studentIdx] = student;

    saveFallbackData("db_exam_attempts.json", examAttempts);
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("exam_attempts").insertOne(newAttempt);
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: student }
        );
      } catch (err: any) {
        console.error("Error saving exam attempt to database:", err.message);
      }
    }

    res.json({
      status: "success",
      attempt: newAttempt,
      score: finalPercent,
      correctCount,
      totalCount: exam.questions.length,
      qualificationStatus: student.qualificationStatus
    });
  });

  app.get("/api/attempts", (req, res) => {
    res.json(examAttempts);
  });


  // --- ANNOUNCEMENTS ---

  app.get("/api/announcements", (req, res) => {
    res.json(announcements);
  });

  app.post("/api/announcements", async (req, res) => {
    const { title, content, audience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Announcement title and script body are mandatory." });
    }

    const newAnc: Announcement = {
      id: "ANC-" + Math.floor(100 + Math.random() * 899),
      title,
      content,
      audience: audience || "ALL",
      date: new Date().toISOString(),
      postedBy: "HPO Headquarters"
    };

    announcements.push(newAnc);
    saveFallbackData("db_announcements.json", announcements);

    if (dbConnected && db) {
      try {
        await db.collection("announcements").insertOne(newAnc);
      } catch (err: any) {
        console.error("Error inserting announcement into database:", err.message);
      }
    }

    res.json({ status: "success", announcement: newAnc });
  });


  // --- CENTERS ---

  app.get("/api/centers", (req, res) => {
    res.json(examCenters);
  });

  app.post("/api/centers", async (req, res) => {
    const { name, city, capacity } = req.body;
    if (!name || !city || !capacity) {
      return res.status(400).json({ error: "Missing name, city or capacity limits." });
    }

    const newCenter: ExamCenter = {
      id: "CEN-" + Math.floor(3005 + Math.random() * 90),
      name,
      city,
      capacity: Number(capacity),
      allocatedStudentsCount: 0
    };

    examCenters.push(newCenter);
    saveFallbackData("db_exam_centers.json", examCenters);

    if (dbConnected && db) {
      try {
        await db.collection("exam_centers").insertOne(newCenter);
      } catch (err: any) {
        console.error("Error inserting exam center into database:", err.message);
      }
    }

    res.json({ status: "success", center: newCenter });
  });

  // --- STATS OVERVIEW FOR ADMIN ---

  app.get("/api/stats", (req, res) => {
    const pendingSchools = schools.filter(s => s.status === "PENDING").length;
    const approvedSchools = schools.filter(s => s.status === "APPROVED").length;
    
    const paidStudents = students.filter(s => s.paymentStatus === "COMPLETED").length;
    const unpaidStudents = students.filter(s => s.paymentStatus !== "COMPLETED").length;
    
    const totalEarnings = paidStudents * 200;
    
    const qualifiedStudents = students.filter(s => s.qualificationStatus === "QUALIFIED").length;

    // Class levels stats breakdown
    const classDistribution: Record<string, number> = {};
    students.forEach(st => {
      classDistribution[st.classLevel] = (classDistribution[st.classLevel] || 0) + 1;
    });

    res.json({
      pendingSchools,
      approvedSchools,
      totalSchools: schools.length,
      paidStudents,
      unpaidStudents,
      totalStudents: students.length,
      totalEarnings,
      qualifiedStudents,
      classDistribution
    });
  });

  // --- DATABASE SYSTEM API ENDPOINTS (PostgreSQL + Fallbacks) ---

  // Get all study materials / items
  app.get("/api/db/items", async (req, res) => {
    try {
      if (dbConnected && db) {
        const result = await db.collection("items").find().sort({ id: 1 }).toArray();
        const mappedItems = result.map((item, idx) => ({
          id: item.id || idx + 1,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          createdAt: item.createdAt || new Date().toISOString()
        }));
        return res.json(mappedItems);
      }
    } catch (err: any) {
      console.error("DB Query error in GET /api/db/items:", err.message);
    }
    // Offline Fallback
    res.json(mockItems);
  });

  // Add a new study material / item
  app.post("/api/db/items", async (req, res) => {
    const { name, description, price, category } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ error: "Missing required item fields: name, description, price, category." });
    }

    const nextId = mockItems.length + 1;
    const newItem = {
      id: nextId,
      name,
      description,
      price: Number(price),
      category,
      createdAt: new Date().toISOString()
    };

    try {
      if (dbConnected && db) {
        await db.collection("items").insertOne(newItem);
        return res.json({ status: "success", item: newItem });
      }
    } catch (err: any) {
      console.error("DB Query error in POST /api/db/items:", err.message);
    }

    // Offline Fallback
    newItem.description = `${description} [Offline Fallback Store]`;
    mockItems.push(newItem);
    saveFallbackData("db_mock_items.json", mockItems);
    res.json({ status: "success", item: newItem });
  });

  // Delete a study material / item
  app.delete("/api/db/items/:id", async (req, res) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid item ID." });
    }

    try {
      if (dbConnected && db) {
        await db.collection("items").deleteOne({ id: itemId });
        return res.json({ status: "success", message: "Item deleted successfully from database." });
      }
    } catch (err: any) {
      console.error("DB Query error in DELETE /api/db/items/:id:", err.message);
    }

    // Offline Fallback
    const index = mockItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      mockItems.splice(index, 1);
      saveFallbackData("db_mock_items.json", mockItems);
      return res.json({ status: "success", message: "Item deleted successfully from mock storage." });
    }
    res.status(404).json({ error: "Item not found." });
  });

  // Get all registered users in database
  app.get("/api/db/users", async (req, res) => {
    try {
      if (dbConnected && db) {
        const result = await db.collection("users").find().sort({ email: 1 }).toArray();
        const mappedUsers = result.map((u, idx) => ({
          id: idx + 1,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: u.created_at || new Date().toISOString()
        }));
        return res.json(mappedUsers);
      }
    } catch (err: any) {
      console.error("DB Query error in GET /api/db/users:", err.message);
    }

    // Offline Fallback (compiles in-memory data for view)
    const compiledUsers: any[] = [];
    compiledUsers.push({ id: 1, email: "admin@eno.org", name: "FNO Head Office Admin", role: "admin", createdAt: new Date().toISOString() });
    
    schools.forEach((sch, idx) => {
      if (sch.status === 'APPROVED') {
        compiledUsers.push({
          id: idx + 2,
          email: sch.email,
          name: sch.name,
          role: "school",
          createdAt: sch.createdAt
        });
      }
    });

    students.forEach((st, idx) => {
      compiledUsers.push({
        id: idx + 100,
        email: st.email,
        name: st.name,
        role: "student",
        createdAt: st.paymentDate || new Date().toISOString()
      });
    });

    res.json(compiledUsers);
  });


  // Vite integration for development mode or static mapping
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started successfully on port ${PORT}`);
  });
}

startServer();
