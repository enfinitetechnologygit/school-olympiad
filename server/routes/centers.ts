import { Router } from "express";
import { db, dbConnected } from "../db";
import { examCenters, saveFallbackData } from "../store";
import { ExamCenter } from "../../src/types";

const router = Router();

  router.get("/", (req, res) => {
    res.json(examCenters);
  });

  router.post("", async (req, res) => {
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

export default router;
