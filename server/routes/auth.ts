import { Router } from "express";
import { db, dbConnected } from "../db";
import { schools, students, saveFallbackData } from "../store";
import { sendNotificationEmail } from "../email";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
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
          if (password === dbUser.password || (dbUser.role === "admin" && password === "admin123")) {
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
      return res.status(401).json({ error: "Invalid Admin Credentials." });
    }

    if (role === "school") {
      // Direct school finder via email or ID
      const school = schools.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (school) {
        if (school.status !== "APPROVED") {
          return res.status(403).json({ error: "Your school registration is currently status: PENDING or REJECTED. Please contact administrator." });
        }
        if (password === school.password) {
          return res.json({
            status: "success",
            user: { role: "school", id: school.id, name: school.name, email: school.email, details: school }
          });
        }
      }
      return res.status(401).json({ error: "Invalid School Credentials. Please ensure your school has been Approved by the admin." });
    }

    if (role === "student") {
      const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (student) {
        if (password === student.password) {
          return res.json({
            status: "success",
            user: { role: "student", id: student.id, name: student.name, email: student.email, details: student }
          });
        }
      }
      return res.status(401).json({ error: "Invalid Student Credentials. Please verify your email and password." });
    }

    return res.status(400).json({ error: "Unsupported login role" });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res) => {
  const { role, email } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required." });
  }

  // 1. Check Admin
  if (role === "admin") {
    if (email.toLowerCase() === "admin@eno.org") {
      const newPassword = Math.random().toString(36).slice(-8);
      // If dbConnected, update users collection
      if (dbConnected && db) {
        try {
          await db.collection("users").updateOne(
            { email: "admin@eno.org", role: "admin" },
            { $set: { password: newPassword } }
          );
        } catch (err: any) {
          console.error("Error resetting admin password in DB:", err.message);
        }
      }
      // Send notification email
      const mailHtml = `<h3>Admin Password Reset</h3><p>Your new admin password is: <strong>${newPassword}</strong></p>`;
      await sendNotificationEmail(email, "Enfinite National Olympiad - Admin Password Reset", mailHtml, `Your new admin password is: ${newPassword}`);
      return res.json({ status: "success", message: "A new password has been sent to your admin email." });
    } else {
      return res.status(404).json({ error: "Admin email not found." });
    }
  }

  // 2. Check School
  if (role === "school") {
    const schoolIdx = schools.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
    if (schoolIdx === -1) {
      return res.status(404).json({ error: "No registered school found with this email." });
    }
    const school = schools[schoolIdx];
    const newPassword = Math.random().toString(36).slice(-8);
    school.password = newPassword;
    schools[schoolIdx] = school;
    saveFallbackData("db_schools.json", schools);

    if (dbConnected && db) {
      try {
        await db.collection("schools").updateOne(
          { id: school.id },
          { $set: { password: newPassword } }
        );
        await db.collection("users").updateOne(
          { email: school.email, role: "school" },
          { $set: { password: newPassword } }
        );
      } catch (err: any) {
        console.error("Error resetting school password in DB:", err.message);
      }
    }

    const mailHtml = `<h3>School Portal Password Reset</h3><p>Dear ${school.coordinatorName},</p><p>Your password has been reset. Your new login password is: <strong>${newPassword}</strong></p>`;
    await sendNotificationEmail(email, "Enfinite National Olympiad - School Password Reset", mailHtml, `Your new school login password is: ${newPassword}`);
    return res.json({ status: "success", message: "A new password has been sent to your coordinator email." });
  }

  // 3. Check Student
  if (role === "student") {
    const studentIdx = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
    if (studentIdx === -1) {
      return res.status(404).json({ error: "No registered student found with this email." });
    }
    const student = students[studentIdx];
    const newPassword = Math.random().toString(36).slice(-8);
    student.password = newPassword;
    students[studentIdx] = student;
    saveFallbackData("db_students.json", students);

    if (dbConnected && db) {
      try {
        await db.collection("students").updateOne(
          { id: student.id },
          { $set: { password: newPassword } }
        );
        await db.collection("users").updateOne(
          { email: student.email, role: "student" },
          { $set: { password: newPassword } }
        );
      } catch (err: any) {
        console.error("Error resetting student password in DB:", err.message);
      }
    }

    const mailHtml = `<h3>Student Portal Password Reset</h3><p>Dear ${student.name},</p><p>Your password has been reset. Your new login password is: <strong>${newPassword}</strong></p>`;
    await sendNotificationEmail(email, "Enfinite National Olympiad - Student Password Reset", mailHtml, `Your new student login password is: ${newPassword}`);
    return res.json({ status: "success", message: "A new password has been sent to your email." });
  }

  return res.status(400).json({ error: "Unsupported role." });
});

export default router;
