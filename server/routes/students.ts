import { Router } from "express";
import { db, dbConnected } from "../db";
import { students, schools, examCenters, saveFallbackData } from "../store";
import { Student } from "../../src/types";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";

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
  const { name, classLevel, gender, dob, mobile, parentName, parentMobile, email, schoolId } = req.body;

  if (!name || !classLevel || !dob || !mobile || !schoolId) {
    return res.status(400).json({ error: "Required fields name, classLevel, dob, mobile, and school selection must be supplied." });
  }

  if (typeof name !== "string" || !/^\p{L}[\p{L}\p{M}'?.-]*(?:\s+\p{L}[\p{L}\p{M}'?.-]*)*$/u.test(name.trim())) {
    return res.status(400).json({ error: "Please enter a valid student name." });
  }
  const dateMatch = typeof dob === "string" && /^(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})-(\d{2})-(\d{4}))$/.exec(dob);
  if (!dateMatch) return res.status(400).json({ error: "Please enter a valid date of birth (YYYY-MM-DD or DD-MM-YYYY)." });
  const year = Number(dateMatch[1] || dateMatch[6]);
  const month = Number(dateMatch[2] || dateMatch[5]);
  const day = Number(dateMatch[3] || dateMatch[4]);
  const birthDate = new Date(Date.UTC(year, month - 1, day));
  if (year < 1000 || birthDate.getUTCFullYear() !== year || birthDate.getUTCMonth() !== month - 1 || birthDate.getUTCDate() !== day || birthDate.getTime() > Date.now()) {
    return res.status(400).json({ error: "Please enter a valid date of birth that is not in the future." });
  }

  if (typeof mobile !== "string" || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }
  // Include legacy formatted numbers; ambiguous numbers cannot identify an account.
  const normalizeMobile = (value: unknown) => typeof value === "string" ? value.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "") : "";
  const records = dbConnected && db ? await db.collection("students").find({}, { projection: { mobile: 1 } }).toArray() : students;
  if (records.some(st => normalizeMobile(st.mobile) === mobile)) {
    return res.status(409).json({ error: "This mobile number is already registered. Contact the Olympiad office for assistance." });
  }

  const parentSchool = schools.find(s => s.id === schoolId);
  if (!parentSchool) {
    return res.status(400).json({ error: "Selected high school coordinate not found inside verified directories." });
  }

  const genStudentId = getNextStudentId();
  const firstName = name.trim().split(/\s+/u)[0].toLowerCase();
  const generatedPassword = firstName.charAt(0).toUpperCase() + firstName.slice(1) + "@" + year;
  const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
  const newStudent: Student = {
    id: genStudentId,
    name: name.trim(),
    classLevel,
    gender: gender || "Other",
    dob,
    mobile: mobile || "",
    parentName: parentName || "TBD",
    parentMobile: parentMobile || "",
    ...(typeof email === "string" && email.trim() ? { email: email.trim() } : {}),
    password: hashedPassword,
    mustChangePassword: true,
    loginMobile: mobile,
    schoolId: parentSchool.id,
    schoolName: parentSchool.name,
    paymentStatus: "COMPLETED",
    paymentAmount: 0,
    qualificationStatus: "TBD",
    admitCardGenerated: true,
    admitCardNumber: "ENO-AC-" + Math.floor(10000 + Math.random() * 89999),
    stage1AdmitNumber: "ENO-AC-" + Math.floor(10000 + Math.random() * 89999),
    stage1AdmitReleased: true
  };

  if (dbConnected && db) {
    try {
      await db.collection("students").insertOne(newStudent);
    } catch (err: any) {
      if (err.code === 11000) return res.status(409).json({ error: "This mobile number or email is already registered." });
      console.error("Error inserting registered student:", err.message);
      return res.status(503).json({ error: "Registration could not be saved. Please try again." });
    }
  }
  students.push(newStudent);
  saveFallbackData("db_students.json", students);

  const { password: _passwordHash, ...studentDetails } = newStudent;
  res.set("Cache-Control", "no-store");
  res.json({ status: "success", student: studentDetails, initialPassword: generatedPassword });
});

// ── Razorpay helpers ──────────────────────────────────────────────────────────

/** Make a signed request to the Razorpay REST API */
function razorpayRequest(method: string, urlPath: string, body?: object): Promise<any> {
  const KEY_ID = process.env.KEY_ID;
  const KEY_SECRET = process.env.KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    return Promise.reject(new Error("Razorpay API keys not configured on server."));
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const payload = body ? JSON.stringify(body) : null;
  const payloadBuffer = payload ? Buffer.from(payload) : Buffer.alloc(0);

  return new Promise((resolve, reject) => {
    const headers: Record<string, string | number> = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Content-Length": payloadBuffer.length,
    };

    const options: https.RequestOptions = {
      hostname: "api.razorpay.com",
      path: urlPath,
      method,
      headers,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(`[Razorpay] ${method} ${urlPath} → HTTP ${res.statusCode}: ${data.slice(0, 200)}`);
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(parsed?.error?.description || parsed?.error?.code || "Razorpay API error"));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`Failed to parse Razorpay response: ${data.slice(0, 100)}`));
        }
      });
    });

    req.on("error", (err) => {
      console.error("[Razorpay] Network error:", err.message);
      reject(err);
    });
    if (payloadBuffer.length > 0) req.write(payloadBuffer);
    req.end();
  });
}

// ── Create Razorpay Order ─────────────────────────────────────────────────────
router.post("/:id/create-order", async (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (student.paymentStatus === "COMPLETED") {
    return res.status(400).json({ error: "Payment already completed for this student." });
  }

  try {
    const order = await razorpayRequest("POST", "/v1/orders", {
      amount: 20000,           // ₹200 in paise
      currency: "INR",
      receipt: `rcpt_${student.id}`,
      notes: {
        student_id: student.id,
        student_name: student.name,
        student_email: student.email,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.KEY_ID,
    });
  } catch (err: any) {
    console.error("Razorpay create-order error:", err.message);
    res.status(502).json({ error: err.message || "Failed to create payment order." });
  }
});

// ── Verify & Complete Razorpay Payment ────────────────────────────────────────
router.post("/:id/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing Razorpay payment verification fields." });
  }

  const studentIdx = students.findIndex((s) => s.id === req.params.id);
  if (studentIdx === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  // Verify HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.warn(`[Razorpay] Signature mismatch for student ${req.params.id}`);
    return res.status(400).json({ error: "Payment verification failed: signature mismatch." });
  }

  // Mark payment complete and generate admit card
  const student = students[studentIdx];
  student.paymentStatus = "COMPLETED";
  student.paymentId = razorpay_payment_id;
  student.paymentAmount = 200;
  student.paymentDate = new Date().toISOString();

  student.admitCardGenerated = true;
  student.admitCardNumber = "ENO-AC-" + Math.floor(10000 + Math.random() * 89999);
  student.stage1AdmitNumber = "ENO-S1-" + Math.floor(10000 + Math.random() * 89999);
  student.stage1AdmitReleased = true;

  const center =
    examCenters.find((c) => c.city.toLowerCase() === student.schoolName.toLowerCase()) ||
    examCenters[0];
  student.examCenterId = center.id;
  center.allocatedStudentsCount += 1;

  students[studentIdx] = student;
  saveFallbackData("db_students.json", students);
  saveFallbackData("db_exam_centers.json", examCenters);

  if (dbConnected && db) {
    try {
      await db.collection("students").updateOne({ id: student.id }, { $set: student });
      await db.collection("exam_centers").updateOne({ id: center.id }, { $set: center });
      await db.collection("users").updateOne(
        { email: student.email },
        { $set: { email: student.email, password: student.password, name: student.name, role: "student" } },
        { upsert: true }
      );
    } catch (err: any) {
      console.error("Error updating verified payment in database:", err.message);
    }
  }

  res.json({ status: "success", student });
});

// Process payment — accepts real Razorpay payment_id from frontend or generates one for admin/cash flows
router.post("/:id/pay", async (req, res) => {
  const studentIdx = students.findIndex(s => s.id === req.params.id);
  if (studentIdx === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const student = students[studentIdx];
  student.paymentStatus = "COMPLETED";
  // Use real Razorpay payment_id if provided by frontend, otherwise generate a fallback ID
  student.paymentId = req.body?.razorpay_payment_id || ("pay_ENO" + Math.floor(1000000 + Math.random() * 8999999));
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

    } catch (err: any) {
      console.error("Error updating payment in database:", err.message);
    }
  }

  // Welcome email has already been sent immediately upon registration.
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

    } catch (err: any) {
      console.error("Error updating payment in database:", err.message);
    }
  }

  // Welcome email has already been sent immediately upon registration.
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

// Update Student Profile Details (Email is read-only and immutable)
router.put("/:id", async (req, res) => {
  const studentIdx = students.findIndex(s => s.id === req.params.id);
  if (studentIdx === -1) {
    return res.status(404).json({ error: "Student record not found." });
  }

  const student = students[studentIdx];
  const { name, classLevel, gender, dob, mobile, parentName, parentMobile, schoolId, photo } = req.body;

  if (name) student.name = name;
  if (classLevel) student.classLevel = classLevel;
  if (gender) student.gender = gender;
  if (dob) student.dob = dob;
  if (mobile !== undefined && mobile !== student.mobile) {
    return res.status(400).json({ error: "Contact the Olympiad office to update your login mobile number." });
  }
  if (parentName) student.parentName = parentName;
  if (parentMobile !== undefined) student.parentMobile = parentMobile;
  if (photo !== undefined) student.photo = photo;

  // Update linked school if changed
  if (schoolId && schoolId !== student.schoolId) {
    const newSchool = schools.find(s => s.id === schoolId);
    if (newSchool) {
      student.schoolId = newSchool.id;
      student.schoolName = newSchool.name;
    }
  }

  // NOTE: email is intentionally read-only & immutable

  students[studentIdx] = student;
  saveFallbackData("db_students.json", students);

  if (dbConnected && db) {
    try {
      await db.collection("students").updateOne(
        { id: student.id },
        { $set: student }
      );
      if (student.email) await db.collection("users").updateOne(
        { email: student.email, role: "student" },
        { $set: { name: student.name } }
      );
    } catch (err: any) {
      console.error("Error updating student profile in DB:", err.message);
    }
  }

  res.json({ status: "success", student });
});

// Upload Student Photo (JPEG and PNG formats only, Max Size 100KB)
router.post("/:id/photo", async (req, res) => {
  const studentIdx = students.findIndex(s => s.id === req.params.id);
  if (studentIdx === -1) {
    return res.status(404).json({ error: "Student record not found." });
  }

  const { photoBase64, mimeType } = req.body;
  if (!photoBase64) {
    return res.status(400).json({ error: "No photo content provided." });
  }

  // 1. Validate File Format (JPEG and PNG only)
  const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  const isMimeValid = mimeType && validMimeTypes.includes(mimeType.toLowerCase());
  const isHeaderValid = /^data:image\/(jpeg|jpg|png);base64,/i.test(photoBase64);

  if (!isMimeValid && !isHeaderValid) {
    return res.status(400).json({ error: "Invalid photo format. Only JPEG (.jpg, .jpeg) and PNG (.png) images are permitted." });
  }

  // Strip Data URI header prefix if present
  const base64Data = photoBase64.replace(/^data:image\/(jpeg|jpg|png);base64,/i, "");
  const buffer = Buffer.from(base64Data, "base64");

  // 2. Validate Size Limit: Max 100KB (100 * 1024 bytes)
  const MAX_SIZE_BYTES = 100 * 1024;
  if (buffer.length > MAX_SIZE_BYTES) {
    const fileSizeKb = (buffer.length / 1024).toFixed(1);
    return res.status(400).json({
      error: `Photo file size (${fileSizeKb}KB) exceeds maximum permitted limit of 100KB. Please compress or select a smaller image.`
    });
  }

  // Determine extension
  let ext = "png";
  if (mimeType?.toLowerCase().includes("jpeg") || mimeType?.toLowerCase().includes("jpg") || photoBase64.startsWith("data:image/jpeg") || photoBase64.startsWith("data:image/jpg")) {
    ext = "jpg";
  }

  // Ensure public/uploads directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const student = students[studentIdx];

  // Delete previous photo file from disk if it exists
  if (student.photo && typeof student.photo === "string" && student.photo.startsWith("/uploads/")) {
    try {
      const previousFileName = path.basename(student.photo);
      const previousFilePath = path.join(uploadsDir, previousFileName);
      if (fs.existsSync(previousFilePath) && fs.lstatSync(previousFilePath).isFile()) {
        fs.unlinkSync(previousFilePath);
        console.log(`[Student Photo Cleanup] Successfully removed previous photo file: ${previousFileName}`);
      }
    } catch (cleanupErr: any) {
      console.warn("[Student Photo Cleanup Warning] Failed to delete previous photo file:", cleanupErr.message);
    }
  }

  const cleanId = req.params.id.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `student_${cleanId}_${Date.now()}.${ext}`;
  const targetPath = path.join(uploadsDir, filename);

  try {
    fs.writeFileSync(targetPath, buffer);
    const photoUrl = `/uploads/${filename}`;

    student.photo = photoUrl;
    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      await db.collection("students").updateOne(
        { id: student.id },
        { $set: { photo: photoUrl } }
      );
    }

    res.json({ status: "success", photoUrl, student });
  } catch (err: any) {
    console.error("Error saving photo file to server storage:", err.message);
    res.status(500).json({ error: "Failed to write photo file to disk storage." });
  }
});

export default router;
