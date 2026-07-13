import { Router } from "express";
import { db, dbConnected } from "../db";
import { announcements, saveFallbackData, headerAnnouncement } from "../store";
import { Announcement } from "../../src/types";

const router = Router();

  router.get("/", (req, res) => {
    res.json(announcements);
  });

  router.get("/header", async (req, res) => {
    if (dbConnected && db) {
      try {
        const doc = await db.collection("settings").findOne({ _id: "header_announcement" as any });
        if (doc) {
          return res.json({ text: doc.text });
        }
      } catch (err: any) {
        console.error("Error loading header announcement from database:", err.message);
      }
    }
    res.json(headerAnnouncement);
  });

  router.post("/header", async (req, res) => {
    const { text } = req.body;
    const updateText = text !== undefined ? String(text) : "";
    headerAnnouncement.text = updateText;
    saveFallbackData("db_header_announcement.json", headerAnnouncement);

    if (dbConnected && db) {
      try {
        await db.collection("settings").updateOne(
          { _id: "header_announcement" as any },
          { $set: { text: updateText } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error updating header announcement in database:", err.message);
      }
    }
    res.json({ status: "success", text: updateText });
  });

  router.delete("/header", async (req, res) => {
    headerAnnouncement.text = "";
    saveFallbackData("db_header_announcement.json", headerAnnouncement);

    if (dbConnected && db) {
      try {
        await db.collection("settings").updateOne(
          { _id: "header_announcement" as any },
          { $set: { text: "" } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error("Error deleting header announcement in database:", err.message);
      }
    }
    res.json({ status: "success", text: "" });
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
