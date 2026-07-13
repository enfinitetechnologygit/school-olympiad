import fs from "fs";
import path from "path";
import { School, Student, MockExam, StudentExamAttempt, Announcement, ExamCenter, ExamSchedule } from "../src/types";

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

export function saveFallbackData<T>(filename: string, data: T) {
  const filePath = path.join(process.cwd(), filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error saving fallback data to ${filename}:`, e);
  }
}

export const defaultSchools: School[] = [];

export let schools: School[] = loadFallbackData("db_schools.json", defaultSchools);

export const defaultStudents: Student[] = [];

export let students: Student[] = loadFallbackData("db_students.json", defaultStudents);

export const defaultMockExams: MockExam[] = [
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

export let mockExams: MockExam[] = loadFallbackData("db_mock_exams.json", defaultMockExams);

export const defaultExamAttempts: StudentExamAttempt[] = [];

export let examAttempts: StudentExamAttempt[] = loadFallbackData("db_exam_attempts.json", defaultExamAttempts);

export const defaultAnnouncements: Announcement[] = [];

export let announcements: Announcement[] = loadFallbackData("db_announcements.json", defaultAnnouncements);

export const defaultHeaderAnnouncement = { text: "Registration ends July 15, 2026. Stage 1 National Pre-Exams on July 30, 2026." };
export let headerAnnouncement = loadFallbackData("db_header_announcement.json", defaultHeaderAnnouncement);

export const defaultSliderImages = ["/girl_laptop.png"];
export let sliderImages = loadFallbackData("db_slider_images.json", defaultSliderImages);


export const defaultExamCenters: ExamCenter[] = [
  { id: "CEN-3001", name: "National Tech Center, New Delhi", city: "New Delhi", capacity: 300, allocatedStudentsCount: 0 },
  { id: "CEN-3002", name: "Silicon Valley Institute, Bengaluru", city: "Bengaluru", capacity: 250, allocatedStudentsCount: 0 },
  { id: "CEN-3003", name: "Salt Lake InfoTech Center, Kolkata", city: "Kolkata", capacity: 200, allocatedStudentsCount: 0 },
  { id: "CEN-3004", name: "Hinjewadi Tech Labs, Pune", city: "Pune", capacity: 150, allocatedStudentsCount: 0 }
];

export let examCenters: ExamCenter[] = loadFallbackData("db_exam_centers.json", defaultExamCenters);

export const defaultExamSchedule: ExamSchedule = {};
export let examSchedule: ExamSchedule = loadFallbackData("db_exam_schedule.json", defaultExamSchedule);

// --- MONGODB CONNECTIVITY SYSTEM & SEEDING ---


// Mock items store for offline fallback
export const defaultMockItems = [
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

export let mockItems = loadFallbackData("db_mock_items.json", defaultMockItems);
