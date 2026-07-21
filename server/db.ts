import { MongoClient, Db } from "mongodb";
import bcryptjs from "bcryptjs";
import {
  schools,
  students,
  mockExams,
  examAttempts,
  announcements,
  examCenters,
  defaultSchools,
  defaultStudents,
  defaultMockExams,
  defaultExamAttempts,
  defaultAnnouncements,
  defaultExamCenters,
  examSchedule,
  headerAnnouncement,
  sliderImages,
  defaultSliderImages,
  mockItems,
  saveFallbackData
} from "./store";

const mongoUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 3000,
});
export let db: Db | null = null;
export let dbConnected = false;

// Mock items store for offline fallback
const defaultMockItems = [
  {
    id: 1,
    name: "Class 5-6 Scratch Block Coding Guide",
    description: "An interactive, colorfully illustrated guide for junior coders learning scratch block sequences, sprite controls, and algorithmic logic loops. [Offline Fallback Store]",
    price: 150.00,
    category: "Study Material",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Class 7-8 Computational Logic Handbook",
    description: "Master flowcharts, truth tables, basic search-sort logic, and introductory Python syntax with detailed solved competition-level modules. [Offline Fallback Store]",
    price: 250.00,
    category: "Study Material",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Class 9-10 Information Technology & Python Masterclass",
    description: "Comprehensive notes covering file handling, relational database basics (SQL queries), arrays, and high-quality past olympiad questions with hints. [Offline Fallback Store]",
    price: 350.00,
    category: "Study Material",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Class 11-12 Advanced Olympiad Prep Kit (Solved Papers)",
    description: "Features fully annotated solutions for past mains examinations. Includes time-complexity analysis, advanced data structures, and secure networks. [Offline Fallback Store]",
    price: 499.00,
    category: "Exam Kit",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Interactive Logic Puzzle Booklet",
    description: "Packed with over 100 logical puzzles, patterns, and computational thinking brainteasers. Perfect for Stage 1 warmup preparations. [Offline Fallback Store]",
    price: 0.00,
    category: "Past Paper",
    createdAt: new Date().toISOString()
  }
];

export async function initializeDatabase() {
  try {
    console.log("Attempting to connect to MongoDB database...");
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("Successfully connected to MongoDB database!");
    dbConnected = true;

    // Database cleanup for mock data
    const mockSchool = await db.collection("schools").findOne({ id: "SCH-2001" });
    if (mockSchool) {
      console.log("Mock data detected in database. Clearing schools, students, exam attempts, and non-admin users...");
      await db.collection("schools").deleteMany({ id: { $in: ["SCH-2001", "SCH-2002", "SCH-2003", "SCH-2004", "RQ-9001", "RQ-9002"] } });
      await db.collection("students").deleteMany({ id: { $in: ["ENO-2026-1001", "ENO-2026-1002", "ENO-2026-1003", "ENO-2026-1004"] } });
      await db.collection("exam_attempts").deleteMany({ id: { $in: ["ATT-1", "ATT-2", "ATT-3"] } });
      await db.collection("announcements").deleteMany({ id: { $in: ["ANC-001", "ANC-002", "ANC-003"] } });
      await db.collection("users").deleteMany({ email: { $in: ["dpsrkp@edu.in", "greenwood@edu.in", "heritage@edu.in", "davaundh@edu.in", "xavier@edu.in", "nps@edu.in", "rohan@eno.org", "arjun@eno.org", "sid@eno.org", "sneha@eno.org"] } });
      await db.collection("exam_centers").updateMany({}, { $set: { allocatedStudentsCount: 0 } });
      console.log("Mock data successfully cleared!");
    }

    // Create collections and verify indexes
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
    }
    await db.collection("users").createIndex({ email: 1 }, { unique: true });

    if (!collectionNames.includes("schools")) {
      await db.createCollection("schools");
    }
    await db.collection("schools").createIndex({ email: 1 }, { unique: true });
    await db.collection("schools").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("students")) {
      await db.createCollection("students");
    }
    await db.collection("students").createIndex({ email: 1 }, { unique: true });
    await db.collection("students").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("mock_exams")) {
      await db.createCollection("mock_exams");
    }
    await db.collection("mock_exams").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("exam_attempts")) {
      await db.createCollection("exam_attempts");
    }
    await db.collection("exam_attempts").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("announcements")) {
      await db.createCollection("announcements");
    }
    await db.collection("announcements").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("exam_centers")) {
      await db.createCollection("exam_centers");
    }
    await db.collection("exam_centers").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("items")) {
      await db.createCollection("items");
    }
    await db.collection("items").createIndex({ id: 1 }, { unique: true });

    if (!collectionNames.includes("exam_schedule")) {
      await db.createCollection("exam_schedule");
    }


    console.log("Database collections and indexes checked/created.");

    // Load state from DB tables at startup if database is connected
    const schoolsCount = await db.collection("schools").countDocuments();
    if (schoolsCount > 0) {
      const dbSchools = await db.collection("schools").find().toArray();
      schools.splice(0, schools.length, ...dbSchools.map(doc => {
        const { _id, ...schoolData } = doc;
        return schoolData as any;
      }));
    } else {
      // Seed schools table with defaultSchools
      for (const s of defaultSchools) {
        await db.collection("schools").updateOne(
          { id: s.id },
          { $set: s },
          { upsert: true }
        );
      }
    }

    const studentsCount = await db.collection("students").countDocuments();
    if (studentsCount > 0) {
      const dbStudents = await db.collection("students").find().toArray();
      students.splice(0, students.length, ...dbStudents.map(doc => {
        const { _id, ...studentData } = doc;
        return studentData as any;
      }));
    } else {
      // Seed students table with defaultStudents
      for (const s of defaultStudents) {
        await db.collection("students").updateOne(
          { id: s.id },
          { $set: s },
          { upsert: true }
        );
      }
    }

    const examsCount = await db.collection("mock_exams").countDocuments();
    if (examsCount > 0) {
      const dbExams = await db.collection("mock_exams").find().toArray();
      mockExams.splice(0, mockExams.length, ...dbExams.map(doc => {
        const { _id, ...examData } = doc;
        return examData as any;
      }));
    } else {
      // Seed mock_exams table with defaultMockExams
      for (const ex of defaultMockExams) {
        await db.collection("mock_exams").updateOne(
          { id: ex.id },
          { $set: ex },
          { upsert: true }
        );
      }
    }

    const attemptsCount = await db.collection("exam_attempts").countDocuments();
    if (attemptsCount > 0) {
      const dbAttempts = await db.collection("exam_attempts").find().toArray();
      examAttempts.splice(0, examAttempts.length, ...dbAttempts.map(doc => {
        const { _id, ...attData } = doc;
        return attData as any;
      }));
    } else {
      for (const att of defaultExamAttempts) {
        await db.collection("exam_attempts").updateOne(
          { id: att.id },
          { $set: att },
          { upsert: true }
        );
      }
    }

    const announcementsCount = await db.collection("announcements").countDocuments();
    if (announcementsCount > 0) {
      const dbAnnouncements = await db.collection("announcements").find().toArray();
      announcements.splice(0, announcements.length, ...dbAnnouncements.map(doc => {
        const { _id, ...ancData } = doc;
        return ancData as any;
      }));
    } else {
      for (const anc of defaultAnnouncements) {
        await db.collection("announcements").updateOne(
          { id: anc.id },
          { $set: anc },
          { upsert: true }
        );
      }
    }

    const centersCount = await db.collection("exam_centers").countDocuments();
    if (centersCount > 0) {
      const dbCenters = await db.collection("exam_centers").find().toArray();
      examCenters.splice(0, examCenters.length, ...dbCenters.map(doc => {
        const { _id, ...cenData } = doc;
        return cenData as any;
      }));
    } else {
      for (const cen of defaultExamCenters) {
        await db.collection("exam_centers").updateOne(
          { id: cen.id },
          { $set: cen },
          { upsert: true }
        );
      }
    }

    // Load exam schedule if stored in DB
    const dbSchedule = await db.collection("exam_schedule").findOne({});
    if (dbSchedule) {
      const { _id, ...scheduleData } = dbSchedule;
      Object.assign(examSchedule, scheduleData);
    }

    // Load header announcement if stored in DB
    try {
      const dbHeaderAnc = await db.collection("settings").findOne({ _id: "header_announcement" as any });
      if (dbHeaderAnc) {
        headerAnnouncement.text = dbHeaderAnc.text;
      }
    } catch (err: any) {
      console.warn("Could not sync header announcement from database:", err.message);
    }

    // Load slider images if stored in DB
    try {
      const dbSlider = await db.collection("settings").findOne({ _id: "slider_images" as any });
      if (dbSlider && Array.isArray(dbSlider.images)) {
        sliderImages.splice(0, sliderImages.length, ...dbSlider.images);
      } else {
        await db.collection("settings").updateOne(
          { _id: "slider_images" as any },
          { $setOnInsert: { images: defaultSliderImages } },
          { upsert: true }
        );
      }
    } catch (err: any) {
      console.warn("Could not sync slider images from database:", err.message);
    }

    // Seed default users if empty
    const usersCount = await db.collection("users").countDocuments();
    if (usersCount === 0) {
      console.log("Seeding default users table...");
      // Seed Admin
      await db.collection("users").insertOne({
        email: 'admin@eno.org',
        password: bcryptjs.hashSync('admin123', 10),
        name: 'FNO Head Office Admin',
        role: 'admin'
      });
      // Seed default schools
      for (const sch of schools) {
        if (sch.status === 'APPROVED') {
          const pass = sch.password || 'school123';
          sch.password = bcryptjs.hashSync(pass, 10);
          await db.collection("users").updateOne(
            { email: sch.email },
            { $setOnInsert: { email: sch.email, password: sch.password, name: sch.name, role: 'school' } },
            { upsert: true }
          );
        }
      }
      // Seed default students
      for (const st of students) {
        const pass = st.password || 'student123';
        st.password = bcryptjs.hashSync(pass, 10);
        await db.collection("users").updateOne(
          { email: st.email },
          { $setOnInsert: { email: st.email, password: st.password, name: st.name, role: 'student' } },
          { upsert: true }
        );
      }
      console.log("Default users seeded.");
    }



    // Load items from database into local mockItems array
    const dbItems = await db.collection("items").find().toArray();
    mockItems.splice(0, mockItems.length, ...dbItems.map(doc => {
      const { _id, ...itemData } = doc;
      return itemData as any;
    }));

    // Save all state to fallback JSON files on startup to ensure sync
    saveFallbackData("db_schools.json", schools);
    saveFallbackData("db_students.json", students);
    saveFallbackData("db_mock_exams.json", mockExams);
    saveFallbackData("db_exam_attempts.json", examAttempts);
    saveFallbackData("db_announcements.json", announcements);
    saveFallbackData("db_exam_centers.json", examCenters);
    saveFallbackData("db_exam_schedule.json", examSchedule);
    saveFallbackData("db_header_announcement.json", headerAnnouncement);
    saveFallbackData("db_slider_images.json", sliderImages);
    saveFallbackData("db_mock_items.json", mockItems);

  } catch (err: any) {
    console.warn("WARNING: MongoDB connection / initialization failed:", err.message);
    console.warn("Falling back to local in-memory stores for users and items.");
    dbConnected = false;
  }
}
