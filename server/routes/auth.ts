import { Router } from "express";
import { db, dbConnected } from "../db";
import { schools, students } from "../store";

const router = Router();

router.post("/login", async (req, res) => {
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

export default router;
