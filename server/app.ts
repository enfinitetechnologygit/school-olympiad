import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeDatabase } from "./db";

// Import routers
import authRouter from "./routes/auth";
import schoolsRouter from "./routes/schools";
import studentsRouter from "./routes/students";
import examsRouter from "./routes/exams";
import announcementsRouter from "./routes/announcements";
import centersRouter from "./routes/centers";
import adminRouter from "./routes/admin";

export async function startServer() {

  console.log("NODE_ENV =", process.env.NODE_ENV);
  console.log("PORT =", process.env.PORT);
  console.log("cwd =", process.cwd());
  await initializeDatabase();
  const app = express();
  const PORT = Number(process.env.PORT) || 3002;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Log API activities
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Mount routers
  app.use("/api/auth", authRouter);
  app.use("/api/schools", schoolsRouter);
  app.use("/api/students", studentsRouter);

  app.use("/api/announcements", announcementsRouter);
  app.use("/api/centers", centersRouter);
  app.use("/api", adminRouter); // adminRouter handles /stats, /db/items, /db/users

  // Handle attempt routes that were under /api/attempts mapped to /attempts in examsRouter
  app.use("/api", examsRouter);

  // Vite integration for development mode or static mapping
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        proxy: {} // Disable proxy in middleware mode to prevent infinite loop back to Express
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Unhandled JSON Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled server error:", err);
    res.status(err.status || 500).json({
      error: err.message || "An internal server error occurred."
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started successfully on port ${PORT}`);
  });
}
