import { Router } from "express";
import { db, dbConnected } from "../db";
import { examSchedule, mockExams, examAttempts, students, saveFallbackData } from "../store";
import { MockExam, StudentExamAttempt } from "../../src/types";
import { GoogleGenAI, Type } from "@google/genai";

const router = Router();

  router.get("/exam-schedule", (req, res) => {
    res.json(examSchedule || {});
  });

  router.post("/exam-schedule", async (req, res) => {
    const { preExamDate, preExamTime, preExamDuration, mainExamDate, mainExamTime, mainExamDuration } = req.body;

    Object.assign(examSchedule, {
      preExamDate,
      preExamTime,
      preExamDuration,
      mainExamDate,
      mainExamTime,
      mainExamDuration
    });

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

  router.get("/exams", (req, res) => {
    res.json(mockExams);
  });

  router.post("/exams", async (req, res) => {
    const { title, classGroup, durationMinutes, questions } = req.body;

    if (!title || !classGroup || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Exam definition missing title, classGroup or formatted questions list." });
    }

    try {
      const nextId = "EXM-" + Math.floor(200 + Math.random() * 200);
      const parsedExam: MockExam = {
        id: nextId,
        title,
        classGroup,
        durationMinutes: Number(durationMinutes) || 45,
        totalQuestions: questions.length,
        questions: questions.map((q: any, idx: number) => {
          if (!q) {
            throw new Error(`Question at index ${idx} is undefined or null.`);
          }
          return {
            id: `Q-${nextId}-${idx + 1}`,
            question: q.question || "Untitled Question",
            options: q.options || ["A", "B", "C", "D"],
            correctOption: Number(q.correctOption) !== undefined && !isNaN(Number(q.correctOption)) ? Number(q.correctOption) : 0
          };
        }),
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
    } catch (err: any) {
      console.error("Error in POST /exams:", err);
      res.status(500).json({ error: err.message || "Failed to publish exam due to an internal server error." });
    }
  });

  // AI Mock Test Generator Endpoint
  router.post("/exams/generate-ai", async (req, res) => {
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
  router.post("/exams/:id/submit", async (req, res) => {
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

  router.get("/attempts", (req, res) => {
    res.json(examAttempts);
  });



export default router;
