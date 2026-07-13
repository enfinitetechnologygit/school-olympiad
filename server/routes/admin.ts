import { Router } from "express";
import { db, dbConnected } from "../db";
import { schools, students, mockItems, saveFallbackData, sliderImages } from "../store";
import fs from "fs";
import path from "path";

const router = Router();

  // GET Slider Images
  router.get("/settings/slider", (req, res) => {
    res.json(sliderImages);
  });

  // POST Add Slider Image Link
  router.post("/settings/slider", async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Image URL string is mandatory." });
    }
    const cleanUrl = url.trim();
    if (!sliderImages.includes(cleanUrl)) {
      sliderImages.push(cleanUrl);
      saveFallbackData("db_slider_images.json", sliderImages);

      if (dbConnected && db) {
        try {
          await db.collection("settings").updateOne(
            { _id: "slider_images" as any },
            { $set: { images: sliderImages } },
            { upsert: true }
          );
        } catch (err: any) {
          console.error("Error saving slider images to database:", err.message);
        }
      }
    }
    res.json({ status: "success", images: sliderImages });
  });

  // POST Upload Slider Image (Base64)
  router.post("/settings/slider/upload", async (req, res) => {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ error: "Missing filename or base64Data." });
    }

    try {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, 'base64');

      const uploadDir = path.join(process.cwd(), "public", "slider_uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = path.extname(filename) || ".png";
      const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9]/g, "_");
      const uniqueFilename = `${baseName}_${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      fs.writeFileSync(filePath, buffer);

      const relativeUrl = `/slider_uploads/${uniqueFilename}`;
      
      if (!sliderImages.includes(relativeUrl)) {
        sliderImages.push(relativeUrl);
        saveFallbackData("db_slider_images.json", sliderImages);

        if (dbConnected && db) {
          try {
            await db.collection("settings").updateOne(
              { _id: "slider_images" as any },
              { $set: { images: sliderImages } },
              { upsert: true }
            );
          } catch (err: any) {
            console.error("Error saving slider images to database:", err.message);
          }
        }
      }

      res.json({ status: "success", images: sliderImages });
    } catch (err: any) {
      console.error("Error uploading slider image:", err);
      res.status(500).json({ error: "Failed to upload image: " + err.message });
    }
  });

  // DELETE Slider Image
  router.delete("/settings/slider", async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Image URL string is mandatory." });
    }
    const cleanUrl = url.trim();
    const index = sliderImages.indexOf(cleanUrl);
    if (index !== -1) {
      sliderImages.splice(index, 1);
      saveFallbackData("db_slider_images.json", sliderImages);

      if (cleanUrl.startsWith("/slider_uploads/")) {
        try {
          const filePath = path.join(process.cwd(), "public", cleanUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
          console.error("Error deleting local slider image file:", e);
        }
      }

      if (dbConnected && db) {
        try {
          await db.collection("settings").updateOne(
            { _id: "slider_images" as any },
            { $set: { images: sliderImages } },
            { upsert: true }
          );
        } catch (err: any) {
          console.error("Error deleting slider image from database:", err.message);
        }
      }
    }
    res.json({ status: "success", images: sliderImages });
  });

  router.get("/stats", (req, res) => {
    const pendingSchools = schools.filter(s => s.status === "PENDING").length;
    const approvedSchools = schools.filter(s => s.status === "APPROVED").length;
    
    const paidStudents = students.filter(s => s.paymentStatus === "COMPLETED").length;
    const unpaidStudents = students.filter(s => s.paymentStatus !== "COMPLETED").length;
    
    const totalEarnings = paidStudents * 200;
    
    const qualifiedStudents = students.filter(s => s.qualificationStatus === "QUALIFIED").length;

    // Class levels stats breakdown
    const classDistribution: Record<string, number> = {};
    students.forEach(st => {
      classDistribution[st.classLevel] = (classDistribution[st.classLevel] || 0) + 1;
    });

    res.json({
      pendingSchools,
      approvedSchools,
      totalSchools: schools.length,
      paidStudents,
      unpaidStudents,
      totalStudents: students.length,
      totalEarnings,
      qualifiedStudents,
      classDistribution
    });
  });

  // --- DATABASE SYSTEM API ENDPOINTS (PostgreSQL + Fallbacks) ---

  // Get all study materials / items
  router.get("/db/items", async (req, res) => {
    try {
      if (dbConnected && db) {
        const result = await db.collection("items").find().sort({ id: 1 }).toArray();
        const mappedItems = result.map((item, idx) => ({
          id: item.id || idx + 1,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          createdAt: item.createdAt || new Date().toISOString()
        }));
        return res.json(mappedItems);
      }
    } catch (err: any) {
      console.error("DB Query error in GET /api/db/items:", err.message);
    }
    // Offline Fallback
    res.json(mockItems);
  });

  // Add a new study material / item
  router.post("/db/items", async (req, res) => {
    const { name, description, price, category } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ error: "Missing required item fields: name, description, price, category." });
    }

    const nextId = mockItems.length + 1;
    const newItem = {
      id: nextId,
      name,
      description,
      price: Number(price),
      category,
      createdAt: new Date().toISOString()
    };

    try {
      if (dbConnected && db) {
        await db.collection("items").insertOne(newItem);
        return res.json({ status: "success", item: newItem });
      }
    } catch (err: any) {
      console.error("DB Query error in POST /api/db/items:", err.message);
    }

    // Offline Fallback
    newItem.description = `${description} [Offline Fallback Store]`;
    mockItems.push(newItem);
    saveFallbackData("db_mock_items.json", mockItems);
    res.json({ status: "success", item: newItem });
  });

  // Delete a study material / item
  router.delete("/db/items/:id", async (req, res) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid item ID." });
    }

    try {
      if (dbConnected && db) {
        await db.collection("items").deleteOne({ id: itemId });
        return res.json({ status: "success", message: "Item deleted successfully from database." });
      }
    } catch (err: any) {
      console.error("DB Query error in DELETE /api/db/items/:id:", err.message);
    }

    // Offline Fallback
    const index = mockItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      mockItems.splice(index, 1);
      saveFallbackData("db_mock_items.json", mockItems);
      return res.json({ status: "success", message: "Item deleted successfully from mock storage." });
    }
    res.status(404).json({ error: "Item not found." });
  });

  // Get all registered users in database
  router.get("/db/users", async (req, res) => {
    try {
      if (dbConnected && db) {
        const result = await db.collection("users").find().sort({ email: 1 }).toArray();
        const mappedUsers = result.map((u, idx) => ({
          id: idx + 1,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: u.created_at || new Date().toISOString()
        }));
        return res.json(mappedUsers);
      }
    } catch (err: any) {
      console.error("DB Query error in GET /api/db/users:", err.message);
    }

    // Offline Fallback (compiles in-memory data for view)
    const compiledUsers: any[] = [];
    compiledUsers.push({ id: 1, email: "admin@eno.org", name: "FNO Head Office Admin", role: "admin", createdAt: new Date().toISOString() });
    
    schools.forEach((sch, idx) => {
      if (sch.status === 'APPROVED') {
        compiledUsers.push({
          id: idx + 2,
          email: sch.email,
          name: sch.name,
          role: "school",
          createdAt: sch.createdAt
        });
      }
    });

    students.forEach((st, idx) => {
      compiledUsers.push({
        id: idx + 100,
        email: st.email,
        name: st.name,
        role: "student",
        createdAt: st.paymentDate || new Date().toISOString()
      });
    });

    res.json(compiledUsers);
  });


export default router;
