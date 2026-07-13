import { Router } from "express";
import { db, dbConnected } from "../db";
import { students, schools, examCenters, saveFallbackData } from "../store";
import { sendLoginCredentials } from "../email";
import { Student } from "../../src/types";

const router = Router();

function getNextStudentId(): string {
  let maxNum = 1000;
  for (const s of students) {
    if (s.id && s.id.startsWith("ENO-2026-")) {
      const num = parseInt(s.id.split("ENO-2026-")[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `ENO-2026-${maxNum + 1}`;
}

  router.get("/", (req, res) => {
    res.json(students);
  });

  router.post("", async (req, res) => {
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

    const genStudentId = getNextStudentId();
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
  router.post("/:id/pay", async (req, res) => {
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
    sendLoginCredentials(student.email, "student", student.id, student.password).catch((e) => {
      console.error("Error sending student registration credentials email:", e.message);
    });

    res.json({ status: "success", student });
  });

  // Process Admin Cash Payment/Registration Approval (Office Entry)
  router.post("/:id/approve-payment", async (req, res) => {
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
    sendLoginCredentials(student.email, "student", student.id, student.password).catch((e) => {
      console.error("Error sending student credentials email on cash approval:", e.message);
    });

    res.json({ status: "success", student });
  });

  // Toggle Admit card manually
  router.post("/:id/generate-admit", async (req, res) => {
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
  router.post("/:id/stage1-release", async (req, res) => {
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
  router.post("/:id/stage2-release", async (req, res) => {
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
  router.post("/:id/allocate-center", async (req, res) => {
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
  router.post("/:id/qualify", async (req, res) => {
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
  router.post("/:id/score", async (req, res) => {
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
  router.post("/bulk-results-upload", async (req, res) => {
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

export default router;
