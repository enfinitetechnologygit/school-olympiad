import { Router } from "express";
import crypto from "crypto";
import { db, dbConnected } from "../db";
import { schools, students, saveFallbackData } from "../store";
import { sendNotificationEmail } from "../email";
import bcryptjs from "bcryptjs";

const router = Router();

interface ResetTokenData {
  token: string;
  email: string;
  role: "admin" | "school" | "student";
  expiresAt: number;
}

const resetTokensMap = new Map<string, ResetTokenData>();

// Both identifier and source are limited, including attempts against unknown numbers.
const attempts = new Map<string, { count: number; until: number }>();
const LIMIT_WINDOW = 15 * 60 * 1000;
function limited(key: string): boolean {
  const entry = attempts.get(key);
  if (entry && entry.until > Date.now()) return entry.count >= 5;
  attempts.delete(key);
  return false;
}
function failed(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.until <= Date.now()) attempts.set(key, { count: 1, until: Date.now() + LIMIT_WINDOW });
  else entry.count++;
}
function normalizeMobile(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "") : "";
}
async function studentAuthentication(req: any, res: any, changeOnly = false) {
  const mobile = req.body.mobile;
  const password = changeOnly ? req.body.currentPassword : req.body.password;
  if (typeof mobile !== "string" || !/^\d{10}$/.test(mobile) || typeof password !== "string") {
    return res.status(400).json({ error: "Enter your 10-digit mobile number and password." });
  }
  const keys = [`mobile:${mobile}`, `ip:${req.ip}`];
  if (keys.some(limited)) return res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
  const records = dbConnected && db ? await db.collection("students").find({}).toArray() : students;
  const matches = records.filter(s => normalizeMobile(s.mobile) === mobile);
  if (matches.length !== 1) {
    keys.forEach(failed);
    return res.status(401).json({ error: "Unable to sign in. Check your credentials or contact the Olympiad office." });
  }
  const student: any = matches[0];
  const legacyUser = dbConnected && db && student.email ? await db.collection("users").findOne({ email: student.email, role: "student" }) : null;
  const hash = legacyUser?.password || student.password;
  if (!hash || !bcryptjs.compareSync(password, hash)) {
    keys.forEach(failed);
    return res.status(401).json({ error: "Unable to sign in. Check your credentials or contact the Olympiad office." });
  }
  const newPassword = req.body.newPassword;
  if (changeOnly || (student.mustChangePassword && newPassword)) {
    if (typeof newPassword !== "string" || newPassword.length < 6 || bcryptjs.compareSync(newPassword, hash)) {
      return res.status(400).json({ error: "Choose a different password of at least 6 characters." });
    }
    const newHash = bcryptjs.hashSync(newPassword, 10);
    if (dbConnected && db) {
      await db.collection("students").updateOne({ id: student.id }, { $set: { password: newHash, mustChangePassword: false } });
      if (legacyUser) await db.collection("users").updateOne({ _id: legacyUser._id }, { $set: { password: newHash } });
    }
    const cached = students.find(s => s.id === student.id);
    if (cached) { cached.password = newHash; cached.mustChangePassword = false; }
    student.mustChangePassword = false;
    saveFallbackData("db_students.json", students);
    if (changeOnly) { keys.forEach(k => attempts.delete(k)); return res.json({ status: "success", message: "Password updated." }); }
  }
  if (student.mustChangePassword) return res.json({ status: "password_change_required" });
  keys.forEach(k => attempts.delete(k));
  const { password: _password, ...details } = student;
  return res.json({ status: "success", user: { role: "student", id: student.id, name: student.name, mobile: student.mobile, email: student.email, details } });
}

// Offline recovery is available only with a persistent database and a non-default admin credential.
async function authorizeResetAdmin(req: any, res: any) {
  if (!dbConnected || !db) { res.status(503).json({ error: "Password reset requests require the database to be online." }); return null; }
  const key = `reset-admin:${req.ip}`;
  if (limited(key)) { res.status(429).json({ error: "Too many attempts. Try again later." }); return null; }
  const { adminEmail, adminPassword, recoveryAdminSecret } = req.body;
  const configuredSecret = process.env.ENO_RECOVERY_ADMIN_SECRET;
  if (!configuredSecret || configuredSecret.length < 32) { res.status(503).json({ error: "Admin reset authorization is not configured." }); return null; }
  const expected = Buffer.from(configuredSecret);
  const supplied = Buffer.from(typeof recoveryAdminSecret === "string" ? recoveryAdminSecret : "");
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) { failed(key); res.status(401).json({ error: "Invalid reset authorization." }); return null; }
  if (typeof adminEmail !== "string" || typeof adminPassword !== "string") { res.status(400).json({ error: "Admin credentials are required." }); return null; }
  const admin = await db.collection("users").findOne({ email: adminEmail.trim().toLowerCase(), role: "admin" });
  if (!admin?.password || !bcryptjs.compareSync(adminPassword, admin.password) || bcryptjs.compareSync("admin123", admin.password)) {
    failed(key); res.status(401).json({ error: "A non-default administrator credential is required." }); return null;
  }
  attempts.delete(key);
  return admin;
}

router.post("/student-reset/request", async (req, res, next) => {
  try {
    if (!dbConnected || !db) return res.status(503).json({ error: "Reset requests are temporarily unavailable. Contact the Olympiad office directly." });
    const { mobile } = req.body;
    if (typeof mobile !== "string" || !/^\d{10}$/.test(mobile)) return res.status(400).json({ error: "Enter a 10-digit mobile number." });
    const key = `reset-request:${req.ip}`;
    if (limited(key)) return res.status(429).json({ error: "Too many requests. Try again later." });
    failed(key);
    await db.collection("student_reset_requests").insertOne({ requestId: crypto.randomUUID(), mobile, status: "pending", createdAt: new Date() });
    return res.json({ message: "Your request has been recorded. Contact the Olympiad office for identity verification." });
  } catch (err) { next(err); }
});

router.post("/student-reset/admin/list", async (req, res, next) => {
  try {
    const admin = await authorizeResetAdmin(req, res); if (!admin || !db) return;
    const requests = await db.collection("student_reset_requests").find({ status: "pending" }, { projection: { _id: 0, requestId: 1, mobile: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(100).toArray();
    res.set("Cache-Control", "no-store"); return res.json({ requests });
  } catch (err) { next(err); }
});

router.post("/student-reset/admin/issue", async (req, res, next) => {
  try {
    const admin = await authorizeResetAdmin(req, res); if (!admin || !db) return;
    const { requestId, verificationNote } = req.body;
    if (typeof requestId !== "string" || typeof verificationNote !== "string" || verificationNote.trim().length < 10 || verificationNote.length > 500) return res.status(400).json({ error: "Record how the student's identity was verified (at least 10 characters)." });
    const request = await db.collection("student_reset_requests").findOne({ requestId, status: "pending" });
    if (!request) return res.status(404).json({ error: "Pending request not found." });
    const allStudents = await db.collection("students").find({}).toArray();
    const matches = allStudents.filter(s => normalizeMobile(s.mobile) === request.mobile);
    if (matches.length !== 1) return res.status(409).json({ error: "Mobile number is missing or ambiguous. Resolve the student records before issuing a credential." });
    const claimed = await db.collection("student_reset_requests").findOneAndUpdate({ requestId, status: "pending" }, { $set: { status: "issued", verifiedBy: admin.email, verificationNote: verificationNote.trim(), verifiedAt: new Date() } });
    if (!claimed) return res.status(409).json({ error: "This request has already been processed." });
    const credential = crypto.randomBytes(32).toString("hex");
    const credentialHash = crypto.createHash("sha256").update(credential).digest("hex");
    await db.collection("student_reset_credentials").deleteMany({ studentId: matches[0].id });
    await db.collection("student_reset_credentials").insertOne({ credentialHash, studentId: matches[0].id, expiresAt: new Date(Date.now() + 30 * 60 * 1000), used: false });
    res.set("Cache-Control", "no-store"); return res.json({ credential, expiresInMinutes: 30 });
  } catch (err) { next(err); }
});

router.post("/student-reset/redeem", async (req, res, next) => {
  try {
    if (!dbConnected || !db) return res.status(503).json({ error: "Password reset is temporarily unavailable." });
    const { mobile, credential, newPassword } = req.body;
    if (typeof mobile !== "string" || !/^\d{10}$/.test(mobile) || typeof credential !== "string" || !/^[a-f0-9]{64}$/.test(credential) || typeof newPassword !== "string" || newPassword.length < 6) return res.status(400).json({ error: "Enter your mobile number, reset credential, and a new password of at least 6 characters." });
    const keys = [`reset-mobile:${mobile}`, `reset-ip:${req.ip}`];
    if (keys.some(limited)) return res.status(429).json({ error: "Too many attempts. Try again later." });
    const matches = (await db.collection("students").find({}).toArray()).filter(s => normalizeMobile(s.mobile) === mobile);
    if (matches.length !== 1) { keys.forEach(failed); return res.status(400).json({ error: "Invalid or expired reset credential." }); }
    const student = matches[0];
    const credentialHash = crypto.createHash("sha256").update(credential).digest("hex");
    const consumed = await db.collection("student_reset_credentials").findOneAndUpdate({ credentialHash, studentId: student.id, used: false, expiresAt: { $gt: new Date() } }, { $set: { used: true, usedAt: new Date() } });
    if (!consumed) { keys.forEach(failed); return res.status(400).json({ error: "Invalid or expired reset credential." }); }
    const passwordHash = bcryptjs.hashSync(newPassword, 10);
    await db.collection("students").updateOne({ id: student.id }, { $set: { password: passwordHash, mustChangePassword: false } });
    if (student.email) await db.collection("users").updateOne({ email: student.email, role: "student" }, { $set: { password: passwordHash } });
    const cached = students.find(s => s.id === student.id);
    if (cached) { cached.password = passwordHash; cached.mustChangePassword = false; }
    keys.forEach(k => attempts.delete(k));
    return res.json({ message: "Password updated. You can now sign in." });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { role, email, password } = req.body;

    if (role === "student") return await studentAuthentication(req, res);
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing login details: email, password, and role are required." });
    }

    // Try database authentication first if DB is connected
    if (dbConnected && db) {
      try {
        const dbUser = await db.collection("users").findOne({
          email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
          role: role
        });
        if (dbUser) {
          if (bcryptjs.compareSync(password, dbUser.password)) {
            let extraDetails = {};
            if (role === "school") {
              extraDetails = schools.find(s => s.email.toLowerCase() === email.toLowerCase()) || {};
            } else if (role === "student") {
              extraDetails = students.find(s => s.email?.toLowerCase() === email.toLowerCase()) || {};
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

    // In-memory array fallback authentication
    if (role === "school") {
      const school = schools.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      if (school) {
        if (school.status !== "APPROVED") {
          return res.status(403).json({ error: "Your school registration is currently status: PENDING or REJECTED. Please contact administrator." });
        }
        if (school.password && bcryptjs.compareSync(password, school.password)) {
          return res.json({
            status: "success",
            user: { role: "school", id: school.id, name: school.name, email: school.email, details: school }
          });
        }
      }
      return res.status(401).json({ error: "Invalid School Credentials. Please verify your email and password." });
    }

    if (role === "admin") {
      if (email.trim().toLowerCase() === "admin@eno.org" && password === "admin123") {
        return res.json({
          status: "success",
          user: { role: "admin", id: "ADMIN-001", name: "System Superadmin", email: "admin@eno.org" }
        });
      }
      return res.status(401).json({ error: "Invalid Admin Credentials." });
    }

    return res.status(400).json({ error: "Unsupported login role." });
  } catch (error) {
    next(error);
  }
});

// Request Password Reset Link (Sends Email with Secure Token Link)
router.post("/forgot-password", async (req, res) => {
  const { role, email } = req.body;
  if (role === "student") return res.status(503).json({ error: "Mobile recovery is unavailable. Contact the Olympiad office for identity verification." });

  if (!email || !role) {
    return res.status(400).json({ error: "Email and portal role selection are required." });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Verify account exists
  let accountFound = false;
  let userName = "User";

  if (role === "admin") {
    if (cleanEmail === "admin@eno.org") {
      accountFound = true;
      userName = "System Administrator";
    }
  } else if (role === "school") {
    const school = schools.find(s => s.email.toLowerCase() === cleanEmail);
    if (school) {
      accountFound = true;
      userName = school.coordinatorName || school.name;
    }
  } else if (role === "student") {
    const student = students.find(s => s.email?.toLowerCase() === cleanEmail);
    if (student) {
      accountFound = true;
      userName = student.name;
    }
  }

  if (!accountFound && dbConnected && db) {
    try {
      const dbUser = await db.collection("users").findOne({
        email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
        role: role
      });
      if (dbUser) {
        accountFound = true;
        userName = dbUser.name || userName;
      }
    } catch (err: any) {
      console.error("Error checking user in DB for reset:", err.message);
    }
  }

  if (!accountFound) {
    return res.status(404).json({ error: `No registered ${role} account found with email address: ${email}` });
  }

  // Generate secure reset token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 60 * 60 * 1000; // 60 minutes expiration

  const tokenData: ResetTokenData = {
    token,
    email: cleanEmail,
    role: role as any,
    expiresAt
  };

  resetTokensMap.set(token, tokenData);

  if (dbConnected && db) {
    try {
      await db.collection("reset_tokens").updateOne(
        { token },
        { $set: tokenData },
        { upsert: true }
      );
    } catch (err: any) {
      console.error("Error storing reset token in DB:", err.message);
    }
  }

  // Construct reset link URL
  const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer as string).origin : "http://localhost:3002");
  const resetUrl = `${origin}/reset-password?token=${token}`;

  const mailSubject = `Enfinite National Olympiad - Password Reset Link`;
  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #2563eb;">
        <h2 style="margin: 0; font-size: 20px; color: #1e293b; font-weight: bold;">Password Reset Request</h2>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6; background-color: #ffffff;">
        <p style="margin-top: 0;">Dear <strong>${userName}</strong>,</p>
        <p>We received a request to reset the password for your <strong>Enfinite National Olympiad</strong> account (${cleanEmail}).</p>
        <p>Please click the button below to set a new password. This link will expire in <strong>60 minutes</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 13px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.3);">
            Reset Password Now
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-bottom: 6px;">If the button above does not work, copy and paste this link into your browser:</p>
        <div style="background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; word-break: break-all;">
          <a href="${resetUrl}" style="font-size: 11px; font-family: monospace; color: #2563eb;">${resetUrl}</a>
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-bottom: 0;">
          If you did not request a password reset, please disregard this message. Your account password will remain unchanged.
        </p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; padding: 15px; border-top: 1px solid #e2e8f0;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;

  const mailText = `Dear ${userName},\n\nUse this link to reset your Enfinite National Olympiad password:\n${resetUrl}\n\nThis link expires in 60 minutes.`;

  await sendNotificationEmail(cleanEmail, mailSubject, mailHtml, mailText);

  res.json({
    status: "success",
    message: `A password reset link has been sent to ${cleanEmail}. Please check your email inbox!`
  });
});

// Verify Reset Token
router.post("/verify-reset-token", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ valid: false, error: "Reset token parameter is required." });
  }

  let tokenData = resetTokensMap.get(token);

  if (!tokenData && dbConnected && db) {
    try {
      const dbToken = await db.collection("reset_tokens").findOne({ token });
      if (dbToken) {
        tokenData = dbToken as any;
      }
    } catch (err: any) {
      console.error("Error verifying reset token in DB:", err.message);
    }
  }

  if (!tokenData || Date.now() > tokenData.expiresAt) {
    return res.status(400).json({ valid: false, error: "This password reset link is invalid or has expired." });
  }

  res.json({ valid: true, email: tokenData.email, role: tokenData.role });
});

// Reset Password Execution
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long." });
  }

  let tokenData = resetTokensMap.get(token);

  if (!tokenData && dbConnected && db) {
    try {
      const dbToken = await db.collection("reset_tokens").findOne({ token });
      if (dbToken) {
        tokenData = dbToken as any;
      }
    } catch (err: any) {
      console.error("Error fetching token from DB:", err.message);
    }
  }

  if (!tokenData || Date.now() > tokenData.expiresAt) {
    return res.status(400).json({ error: "This password reset link is invalid or has expired." });
  }

  const { email, role } = tokenData;
  const hashedPassword = bcryptjs.hashSync(newPassword, 10);

  // Update password based on role
  if (role === "admin") {
    if (dbConnected && db) {
      await db.collection("users").updateOne(
        { email: "admin@eno.org", role: "admin" },
        { $set: { password: hashedPassword } }
      );
    }
  } else if (role === "school") {
    const schoolIdx = schools.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
    if (schoolIdx !== -1) {
      schools[schoolIdx].password = hashedPassword;
      saveFallbackData("db_schools.json", schools);
    }
    if (dbConnected && db) {
      await db.collection("schools").updateOne(
        { email: { $regex: new RegExp(`^${email}$`, "i") } },
        { $set: { password: hashedPassword } }
      );
      await db.collection("users").updateOne(
        { email: { $regex: new RegExp(`^${email}$`, "i") }, role: "school" },
        { $set: { password: hashedPassword } }
      );
    }
  } else if (role === "student") {
    const studentIdx = students.findIndex(s => s.email?.toLowerCase() === email.toLowerCase());
    if (studentIdx !== -1) {
      students[studentIdx].password = hashedPassword;
      saveFallbackData("db_students.json", students);
    }
    if (dbConnected && db) {
      await db.collection("students").updateOne(
        { email: { $regex: new RegExp(`^${email}$`, "i") } },
        { $set: { password: hashedPassword } }
      );
      await db.collection("users").updateOne(
        { email: { $regex: new RegExp(`^${email}$`, "i") }, role: "student" },
        { $set: { password: hashedPassword } }
      );
    }
  }

  // Delete invalidated reset token
  resetTokensMap.delete(token);
  if (dbConnected && db) {
    try {
      await db.collection("reset_tokens").deleteOne({ token });
    } catch (e: any) {}
  }

  res.json({
    status: "success",
    message: "Your password has been successfully reset! You can now log in with your new password."
  });
});

// Change Password for Logged-In User (Student, School, or Admin)
router.post("/change-password", async (req, res, next) => {
  const { role, email, currentPassword, newPassword } = req.body;
  if (role === "student") return studentAuthentication(req, res, true).catch(next);

  if (!role || !email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Missing required fields: role, email, currentPassword, and newPassword are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long." });
  }

  const cleanEmail = email.trim().toLowerCase();
  let existingHashedPassword = "";
  let userFound = false;

  // 1. Check in MongoDB if connected
  if (dbConnected && db) {
    try {
      const dbUser = await db.collection("users").findOne({
        email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
        role: role
      });
      if (dbUser && dbUser.password) {
        existingHashedPassword = dbUser.password;
        userFound = true;
      }
    } catch (err: any) {
      console.error("Error finding user in DB for password change:", err.message);
    }
  }

  // 2. Check in-memory stores if not found in DB
  if (!userFound) {
    if (role === "admin") {
      if (cleanEmail === "admin@eno.org") {
        existingHashedPassword = bcryptjs.hashSync("admin123", 10);
        userFound = true;
      }
    } else if (role === "school") {
      const school = schools.find(s => s.email.toLowerCase() === cleanEmail);
      if (school && school.password) {
        existingHashedPassword = school.password;
        userFound = true;
      }
    } else if (role === "student") {
      const student = students.find(s => s.email?.toLowerCase() === cleanEmail);
      if (student && student.password) {
        existingHashedPassword = student.password;
        userFound = true;
      }
    }
  }

  if (!userFound) {
    return res.status(404).json({ error: `Account not found for ${role} with email ${email}.` });
  }

  // Verify current password
  let isCurrentValid = false;
  if (existingHashedPassword.startsWith("$2a$") || existingHashedPassword.startsWith("$2b$")) {
    isCurrentValid = bcryptjs.compareSync(currentPassword, existingHashedPassword);
  } else {
    isCurrentValid = currentPassword === existingHashedPassword;
  }

  if (!isCurrentValid) {
    return res.status(400).json({ error: "Current password is incorrect. Please verify your existing password." });
  }

  // Hash new password
  const newHashedPassword = bcryptjs.hashSync(newPassword, 10);

  // Update password according to role
  if (role === "admin") {
    if (dbConnected && db) {
      await db.collection("users").updateOne(
        { email: "admin@eno.org", role: "admin" },
        { $set: { password: newHashedPassword } },
        { upsert: true }
      );
    }
  } else if (role === "school") {
    const schoolIdx = schools.findIndex(s => s.email.toLowerCase() === cleanEmail);
    if (schoolIdx !== -1) {
      schools[schoolIdx].password = newHashedPassword;
      saveFallbackData("db_schools.json", schools);
    }
    if (dbConnected && db) {
      await db.collection("schools").updateOne(
        { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } },
        { $set: { password: newHashedPassword } }
      );
      await db.collection("users").updateOne(
        { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") }, role: "school" },
        { $set: { password: newHashedPassword } },
        { upsert: true }
      );
    }
  } else if (role === "student") {
    const studentIdx = students.findIndex(s => s.email?.toLowerCase() === cleanEmail);
    if (studentIdx !== -1) {
      students[studentIdx].password = newHashedPassword;
      saveFallbackData("db_students.json", students);
    }
    if (dbConnected && db) {
      await db.collection("students").updateOne(
        { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") } },
        { $set: { password: newHashedPassword } }
      );
      await db.collection("users").updateOne(
        { email: { $regex: new RegExp(`^${cleanEmail}$`, "i") }, role: "student" },
        { $set: { password: newHashedPassword } },
        { upsert: true }
      );
    }
  }

  res.json({
    status: "success",
    message: "Your password has been updated successfully!"
  });
});

export default router;
