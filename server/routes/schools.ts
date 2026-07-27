import { Router } from "express";
import { db, dbConnected } from "../db";
import { schools, students, saveFallbackData } from "../store";
import { sendSchoolPendingConfirmation, sendNotificationEmail, sendLoginCredentials } from "../email";
import { School } from "../../src/types";
import bcryptjs from "bcryptjs";

const router = Router();

function getNextSchoolId(): string {
  let maxNum = 1000;
  for (const s of schools) {
    if (s.id && s.id.startsWith("SCH-")) {
      const num = parseInt(s.id.split("-")[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `SCH-${maxNum + 1}`;
}

function getNextRequestId(): string {
  let maxNum = 1000;
  for (const s of schools) {
    if (s.id && s.id.startsWith("RQ-")) {
      const num = parseInt(s.id.split("-")[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `RQ-${maxNum + 1}`;
}

async function getSchoolIndexAndObject(targetId: string): Promise<{ school: School | null, index: number }> {
  let idx = schools.findIndex(s => s.id === targetId);
  if (idx !== -1) {
    return { school: schools[idx], index: idx };
  }

  if (dbConnected && db) {
    try {
      const dbSchool = await db.collection("schools").findOne({ id: targetId });
      if (dbSchool) {
        const { _id, ...schoolData } = dbSchool;
        const school = schoolData as School;
        schools.push(school);
        return { school, index: schools.length - 1 };
      }
    } catch (err: any) {
      console.error("Error fetching school from DB for cache sync:", err.message);
    }
  }

  return { school: null, index: -1 };
}

router.post("", async (req, res) => {
  const { name, principalName, coordinatorName, mobile, email, address, city, state, boardType, totalStudents } = req.body;

  if (!name || !email || !coordinatorName || !mobile || !city || !state) {
    return res.status(400).json({ error: "Missing required school registration fields." });
  }

  // Check duplicate in database first if connected
  if (dbConnected && db) {
    try {
      const existingSchool = await db.collection("schools").findOne({
        email: { $regex: new RegExp(`^${email.trim()}$`, "i") }
      });
      if (existingSchool) {
        return res.status(400).json({ error: "A school with this email is already registered." });
      }
    } catch (err: any) {
      console.error("Error checking duplicate school in DB:", err.message);
    }
  } else {
    return res.status(400).json({ error: "A school with this email is already registered." });
  }

  const requestSchoolId = getNextRequestId();
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

  // schools.push(newSchool);
  // saveFallbackData("db_schools.json", schools);

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

router.get("", async (req, res) => {
  if (dbConnected && db) {
    try {
      const dbSchools = await db.collection("schools").find().toArray();
      const formattedSchools = dbSchools.map(doc => {
        const { _id, ...schoolData } = doc;
        return schoolData;
      });
      return res.json(formattedSchools);
    } catch (err: any) {
      console.error("Error fetching schools from DB:", err.message);
    }
  }
  res.json(schools);
});

// Get a single school by ID
router.get("/:id", async (req, res) => {
  const targetId = req.params.id;
  const { school } = await getSchoolIndexAndObject(targetId);
  if (!school) {
    return res.status(404).json({ error: "School not found." });
  }
  res.json(school);
});

// Update a school's Pre-Exam schedule
router.post("/:id/schedule", async (req, res) => {
  const targetId = req.params.id;
  const { school, index: schoolIdx } = await getSchoolIndexAndObject(targetId);

  if (schoolIdx === -1 || !school) {
    return res.status(404).json({ error: "School not found." });
  }

  const { preExamDate, preExamTime, preExamDuration } = req.body;
  if (!preExamDate || !preExamTime || !preExamDuration) {
    return res.status(400).json({ error: "Missing required fields: preExamDate, preExamTime, preExamDuration." });
  }
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
router.post("/:id/approve", async (req, res) => {
  const targetId = req.params.id;
  const { school, index: schoolIdx } = await getSchoolIndexAndObject(targetId);

  if (schoolIdx === -1 || !school) {
    return res.status(404).json({ error: "School registration request not found." });
  }
  const generatedSchoolId = getNextSchoolId();
  const oldId = school.id;

  const generatedPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
  school.id = generatedSchoolId;
  school.status = "APPROVED";
  school.password = hashedPassword;

  // Update in-place
  schools[schoolIdx] = school;
  saveFallbackData("db_schools.json", schools);

  if (dbConnected && db) {
    try {
      await db.collection("schools").deleteOne({ id: oldId });
      await db.collection("schools").insertOne(school);
      await db.collection("users").updateOne(
        { email: school.email },
        { $set: { email: school.email, password: hashedPassword, name: school.name, role: "school" } },
        { upsert: true }
      );
    } catch (err: any) {
      console.error("Error approving school in database:", err.message);
    }
  }

  // Send approved credentials email with plain text password and personalized name
  sendLoginCredentials(school.email, "school", school.id, generatedPassword, school.coordinatorName).catch((e) => {
    console.error("Error sending school approval credentials email:", e.message);
  });

  res.json({ status: "success", school });
});

// Reject a school
router.post("/:id/reject", async (req, res) => {
  const targetId = req.params.id;
  const { school, index: schoolIdx } = await getSchoolIndexAndObject(targetId);

  if (schoolIdx === -1 || !school) {
    return res.status(404).json({ error: "School registration request not found." });
  }

  school.status = "REJECTED";
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

  res.json({ status: "success", school });
});

// Delete a school
router.delete("/:id", async (req, res) => {
  const targetId = req.params.id;
  const { school, index: schoolIdx } = await getSchoolIndexAndObject(targetId);

  if (schoolIdx === -1 || !school) {
    return res.status(404).json({ error: "School not found." });
  }
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
router.post("/:id/passing-marks", async (req, res) => {
  const targetId = req.params.id;
  const { school, index: schoolIdx } = await getSchoolIndexAndObject(targetId);

  if (schoolIdx === -1 || !school) {
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

// Update School Profile Details (Email & ID are read-only)
router.put("/:id", async (req, res) => {
  const targetId = req.params.id;
  const { school, index: schoolIdx } = await getSchoolIndexAndObject(targetId);

  if (schoolIdx === -1 || !school) {
    return res.status(404).json({ error: "School record not found." });
  }
  const { name, principalName, coordinatorName, mobile, address, city, state, boardType, totalStudents } = req.body;

  if (name) school.name = name;
  if (principalName) school.principalName = principalName;
  if (coordinatorName) school.coordinatorName = coordinatorName;
  if (mobile) school.mobile = mobile;
  if (address) school.address = address;
  if (city) school.city = city;
  if (state) school.state = state;
  if (boardType) school.boardType = boardType;
  if (totalStudents !== undefined) school.totalStudents = Number(totalStudents);

  // Email & ID are intentionally read-only & immutable

  schools[schoolIdx] = school;
  saveFallbackData("db_schools.json", schools);

  // Update schoolName for linked students if name changed
  if (name) {
    students.forEach(st => {
      if (st.schoolId === targetId) {
        st.schoolName = name;
      }
    });
    saveFallbackData("db_students.json", students);
  }

  if (dbConnected && db) {
    try {
      await db.collection("schools").updateOne(
        { id: targetId },
        { $set: school }
      );
      if (name) {
        await db.collection("students").updateMany(
          { schoolId: targetId },
          { $set: { schoolName: name } }
        );
      }
      await db.collection("users").updateOne(
        { email: school.email },
        { $set: { name: school.name } }
      );
    } catch (err: any) {
      console.error("Error updating school profile in database:", err.message);
    }
  }

  res.json({ status: "success", school });
});

export default router;
