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

router.post("/login", async (req, res, next) => {
  try {
    const { role, email, password } = req.body;

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

    if (role === "student") {
      const student = students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      if (student) {
        if (student.password && bcryptjs.compareSync(password, student.password)) {
          return res.json({
            status: "success",
            user: { role: "student", id: student.id, name: student.name, email: student.email, details: student }
          });
        }
      }
      return res.status(401).json({ error: "Invalid Student Credentials. Please verify your email and password." });
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
    const student = students.find(s => s.email.toLowerCase() === cleanEmail);
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
  const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer as string).origin : "http://localhost:3000");
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
    const studentIdx = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
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
router.post("/change-password", async (req, res) => {
  const { role, email, currentPassword, newPassword } = req.body;

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
      const student = students.find(s => s.email.toLowerCase() === cleanEmail);
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
    const studentIdx = students.findIndex(s => s.email.toLowerCase() === cleanEmail);
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
