import { Router } from "express";
import { db, dbConnected } from "../db";
import { announcements, saveFallbackData } from "../store";
import { Announcement } from "../../src/types";

const router = Router();

  router.get("/", (req, res) => {
    res.json(announcements);
  });

  router.post("", async (req, res) => {
    const { title, content, audience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Announcement title and script body are mandatory." });
    }

    const newAnc: Announcement = {
      id: "ANC-" + Math.floor(100 + Math.random() * 899),
      title,
      content,
      audience: audience || "ALL",
      date: new Date().toISOString(),
      postedBy: "HPO Headquarters"
    };

    announcements.push(newAnc);
    saveFallbackData("db_announcements.json", announcements);

    if (dbConnected && db) {
      try {
        await db.collection("announcements").insertOne(newAnc);
      } catch (err: any) {
        console.error("Error inserting announcement into database:", err.message);
      }
    }

    res.json({ status: "success", announcement: newAnc });
  });

export default router;
