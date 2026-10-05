import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});
console.log("HOST:", process.env.AIVEN_MYSQL_HOST);
console.log("USER:", process.env.AIVEN_MYSQL_USER);
console.log("DB:", process.env.AIVEN_MYSQL_DATABASE);
const app = express();
const PORT = 3000;


app.use(express.json());

// MySQL Pool helper for Aiven
let pool: mysql.Pool | null = null;

function getMySQLPool() {
  if (!pool) {
    const host = process.env.AIVEN_MYSQL_HOST;
    const user = process.env.AIVEN_MYSQL_USER;
    const password = process.env.AIVEN_MYSQL_PASSWORD;
    const database = process.env.AIVEN_MYSQL_DATABASE;
    const port = Number(process.env.AIVEN_MYSQL_PORT || 3306);

    if (!host || !user || !database) {
      throw new Error("Aiven MySQL connection parameters (AIVEN_MYSQL_HOST, AIVEN_MYSQL_USER, AIVEN_MYSQL_DATABASE) are not fully configured.");
    }

    pool = mysql.createPool({
      host,
      port,
      user,
      password: password || '',
      database,
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Initialize tables in Aiven MySQL if configured
async function initMySQLTables() {
  try {
    const dbPool = getMySQLPool();
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(64) PRIMARY KEY,
        rollNumber VARCHAR(64) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        departmentId VARCHAR(64),
        classId VARCHAR(64),
        phone VARCHAR(64),
        profilePhoto TEXT,
        username VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        departmentId VARCHAR(64),
        phone VARCHAR(64),
        profilePhoto TEXT,
        username VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(64) NOT NULL UNIQUE
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(64) PRIMARY KEY,
        departmentId VARCHAR(64) NOT NULL,
        academicYearId VARCHAR(64) NOT NULL,
        yearNumber INT NOT NULL,
        section VARCHAR(32) NOT NULL
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS attendance_sessions (
        id VARCHAR(64) PRIMARY KEY,
        staffId VARCHAR(64),
        subjectId VARCHAR(64),
        classId VARCHAR(64),
        date VARCHAR(32),
        startTime VARCHAR(32),
        endTime VARCHAR(32),
        status VARCHAR(32),
        createdAt VARCHAR(64)
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id VARCHAR(64) PRIMARY KEY,
        sessionId VARCHAR(64),
        studentId VARCHAR(64),
        status VARCHAR(32),
        markedAt VARCHAR(64)
      )
    `);

    console.log("Aiven MySQL tables ('students', 'staff', 'departments', 'classes', 'attendance_sessions', 'attendance_records') initialized successfully.");
    
    // Seed data
    await seedMySQLData(dbPool);
  } catch (err) {
    console.warn("Could not initialize MySQL tables automatically (Check Aiven connection settings):", err);
  }
}

// Helper to seed standard initial dataset into Aiven MySQL if tables are empty
async function seedMySQLData(dbPool: mysql.Pool) {
  try {
    // 1. Seed Departments
    const [existingDepts]: any = await dbPool.query("SELECT COUNT(*) as count FROM departments");
    if (existingDepts[0].count === 0) {
      console.log("Seeding initial departments...");
      const depts = [
        ['dept-1', 'Computer Science & Engineering', 'CSE'],
        ['dept-2', 'Information Technology', 'IT'],
        ['dept-3', 'Electronics & Communication', 'ECE'],
        ['dept-4', 'Mechanical Engineering', 'MECH']
      ];
      for (const d of depts) {
        await dbPool.query("INSERT INTO departments (id, name, code) VALUES (?, ?, ?)", d);
      }
    }

    // 2. Seed Classes
    const [existingClasses]: any = await dbPool.query("SELECT COUNT(*) as count FROM classes");
    if (existingClasses[0].count === 0) {
      console.log("Seeding initial classes...");
      const classes = [
        ['cls-1', 'dept-1', 'ay-2', 2, 'A'],
        ['cls-2', 'dept-1', 'ay-2', 2, 'B'],
        ['cls-3', 'dept-1', 'ay-2', 3, 'A'],
        ['cls-4', 'dept-2', 'ay-2', 2, 'A']
      ];
      for (const c of classes) {
        await dbPool.query("INSERT INTO classes (id, departmentId, academicYearId, yearNumber, section) VALUES (?, ?, ?, ?, ?)", c);
      }
    }

    // 3. Seed Staff
    const [existingStaff]: any = await dbPool.query("SELECT COUNT(*) as count FROM staff");
    if (existingStaff[0].count === 0) {
      console.log("Seeding initial staff...");
      const staff = [
        ['staff-1', 'Prof. Subburaj', 'subburaj@college.edu', 'dept-1', '+91 94433 11223', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', 'subburaj', '••••••••••••'],
        ['staff-2', 'Dr. Smith', 'faculty.smith@college.edu', 'dept-1', '+91 94433 22334', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', 'faculty.smith@campusattend.edu', '••••••••••••'],
        ['staff-3', 'Admin Staff', 'admin@college.edu', 'dept-1', '+91 90000 00000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', 'staff', '••••••••••••']
      ];
      for (const s of staff) {
        await dbPool.query("INSERT INTO staff (id, name, email, departmentId, phone, profilePhoto, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", s);
      }
    }

    // 4. Seed Students
    const [existingStudents]: any = await dbPool.query("SELECT COUNT(*) as count FROM students");
    if (existingStudents[0].count === 0) {
      console.log("Seeding initial students...");
      const students = [
        ['stu-1', 'CSE2026001', 'Anand C', 'anand.c@college.edu', 'dept-1', 'cls-1', '+91 98765 43210', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', 'anand_c', 'password'],
        ['stu-2', 'CSE2026002', 'Arun Kumar', 'arun.kumar@college.edu', 'dept-1', 'cls-1', '+91 98765 43211', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 'student_username', '••••••••••••'],
        ['stu-3', 'CSE2026003', 'Ravi Sharma', 'ravi.sharma@college.edu', 'dept-1', 'cls-1', '+91 98765 43212', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'ravi_sharma', '••••••••••••'],
        ['stu-4', 'CSE2026004', 'Priya Patel', 'priya.patel@college.edu', 'dept-1', 'cls-1', '+91 98765 43213', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 'priya_patel', '••••••••••••'],
        ['stu-5', 'CSE2026005', 'Vijay Verma', 'vijay.verma@college.edu', 'dept-1', 'cls-1', '+91 98765 43214', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'vijay_verma', '••••••••••••']
      ];
      for (const stu of students) {
        await dbPool.query("INSERT INTO students (id, rollNumber, name, email, departmentId, classId, phone, profilePhoto, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", stu);
      }
    }

    // 5. Seed Attendance Session and Records
    const [existingSessions]: any = await dbPool.query("SELECT COUNT(*) as count FROM attendance_sessions");
    if (existingSessions[0].count === 0) {
      console.log("Seeding initial attendance session...");
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      await dbPool.query(
        "INSERT INTO attendance_sessions (id, staffId, subjectId, classId, date, startTime, endTime, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['sess-1', 'staff-1', 'sub-1', 'cls-1', yesterday, '09:00', '09:50', 'CLOSED', new Date().toISOString()]
      );

      console.log("Seeding initial attendance records...");
      const records = [
        ['rec-1', 'sess-1', 'stu-1', 'PRESENT', new Date().toISOString()],
        ['rec-2', 'sess-1', 'stu-2', 'PRESENT', new Date().toISOString()],
        ['rec-3', 'sess-1', 'stu-3', 'PRESENT', new Date().toISOString()],
        ['rec-4', 'sess-1', 'stu-4', 'ABSENT', new Date().toISOString()],
        ['rec-5', 'sess-1', 'stu-5', 'PRESENT', new Date().toISOString()]
      ];
      for (const r of records) {
        await dbPool.query("INSERT INTO attendance_records (id, sessionId, studentId, status, markedAt) VALUES (?, ?, ?, ?, ?)", r);
      }
    }

    console.log("All Aiven MySQL database tables successfully seeded with default dataset.");
  } catch (err) {
    console.warn("Seeding database table error:", err);
  }
}

// Try initializing tables on startup if configured
setTimeout(() => {
  if (process.env.AIVEN_MYSQL_HOST) {
    initMySQLTables();
  }
}, 1000);

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CampusAttend Aiven MySQL Backend" });
});

// Test connection endpoint
app.get("/api/db/test", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    const [rows] = await dbPool.query("SELECT 1 AS connected");
    await initMySQLTables();
    res.json({ success: true, message: "Successfully connected and verified Aiven MySQL database!", data: rows });
  } catch (error: any) {
    console.error("Aiven MySQL connection test failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to connect to Aiven MySQL. Please verify your environment variables." 
    });
  }
});

// Seed database endpoint
app.post("/api/db/seed", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    await seedMySQLData(dbPool);
    res.json({ success: true, message: "Aiven MySQL Database tables successfully seeded with default dataset." });
  } catch (error: any) {
    console.error("Aiven MySQL seeding failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get database configuration status
app.get("/api/db/status", (req, res) => {
  const host = process.env.AIVEN_MYSQL_HOST;
  const user = process.env.AIVEN_MYSQL_USER;
  const database = process.env.AIVEN_MYSQL_DATABASE;
  const port = process.env.AIVEN_MYSQL_PORT || "3306";

  const isConfigured = Boolean(host && user && database);
  res.json({
    configured: isConfigured,
    host: host || "Not configured",
    port,
    user: user || "Not configured",
    database: database || "Not configured"
  });
});

// Students API
app.get("/api/students", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    await initMySQLTables();
    const [rows] = await dbPool.query("SELECT id, rollNumber, name, email, departmentId, classId, phone, profilePhoto, username FROM students");
    res.json({ success: true, students: rows });
  } catch (error: any) {
    console.error("Failed to fetch students from MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { id, rollNumber, name, email, departmentId, classId, phone, profilePhoto, username, password } = req.body;
    if (!rollNumber || !name || !username || !password) {
      return res.status(400).json({ success: false, error: "Missing required student details (rollNumber, name, username, password)." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    const studentId = id || `stu-${Date.now()}`;
    const photo = profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

    await dbPool.query(
      `INSERT INTO students (id, rollNumber, name, email, departmentId, classId, phone, profilePhoto, username, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=?, email=?, departmentId=?, classId=?, phone=?, profilePhoto=?, password=?`,
      [studentId, rollNumber, name, email || '', departmentId || '', classId || '', phone || '', photo, username, password,
       name, email || '', departmentId || '', classId || '', phone || '', photo, password]
    );

    res.json({ 
      success: true, 
      student: { id: studentId, rollNumber, name, email, departmentId, classId, phone, profilePhoto: photo, username } 
    });
  } catch (error: any) {
    console.error("Failed to save student to MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/auth/student-login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    const [rows]: any = await dbPool.query(
      "SELECT id, rollNumber, name, email, departmentId, classId, phone, profilePhoto, username FROM students WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid username or password." });
    }

    res.json({ success: true, student: rows[0] });
  } catch (error: any) {
    console.error("Student login failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Staff API
app.get("/api/staff", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    await initMySQLTables();
    const [rows] = await dbPool.query("SELECT id, name, email, departmentId, phone, profilePhoto, username FROM staff");
    res.json({ success: true, staff: rows });
  } catch (error: any) {
    console.error("Failed to fetch staff from MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/staff", async (req, res) => {
  try {
    const { id, name, email, departmentId, phone, profilePhoto, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ success: false, error: "Missing required staff details (name, username, password)." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    const staffId = id || `staff-${Date.now()}`;
    const photo = profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200';

    await dbPool.query(
      `INSERT INTO staff (id, name, email, departmentId, phone, profilePhoto, username, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=?, email=?, departmentId=?, phone=?, profilePhoto=?, password=?`,
      [staffId, name, email || '', departmentId || '', phone || '', photo, username, password,
       name, email || '', departmentId || '', phone || '', photo, password]
    );

    res.json({ 
      success: true, 
      staff: { id: staffId, name, email, departmentId, phone, profilePhoto: photo, username } 
    });
  } catch (error: any) {
    console.error("Failed to save staff to MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/auth/staff-login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    const [rows]: any = await dbPool.query(
      "SELECT id, name, email, departmentId, phone, profilePhoto, username FROM staff WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid username or password." });
    }

    res.json({ success: true, staff: rows[0] });
  } catch (error: any) {
    console.error("Staff login failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Attendance API
app.get("/api/attendance/sessions", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    await initMySQLTables();
    const [sessionRows]: any = await dbPool.query("SELECT * FROM attendance_sessions ORDER BY createdAt DESC");
    const [recordRows]: any = await dbPool.query("SELECT * FROM attendance_records");

    const sessions = sessionRows.map((sess: any) => ({
      ...sess,
      records: recordRows.filter((r: any) => r.sessionId === sess.id)
    }));

    res.json({ success: true, sessions });
  } catch (error: any) {
    console.error("Failed to fetch attendance sessions from MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/attendance/sessions", async (req, res) => {
  try {
    const { id, staffId, subjectId, classId, date, startTime, endTime, status } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: "Session ID is required." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    await dbPool.query(
      `INSERT INTO attendance_sessions (id, staffId, subjectId, classId, date, startTime, endTime, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status=?, endTime=?`,
      [id, staffId, subjectId, classId, date, startTime, endTime || '10:00', status || 'OPEN', new Date().toISOString(),
       status || 'OPEN', endTime || '10:00']
    );

    res.json({ success: true, sessionId: id });
  } catch (error: any) {
    console.error("Failed to save attendance session to MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/attendance/submit", async (req, res) => {
  try {
    const { sessionId, records } = req.body;
    if (!sessionId || !Array.isArray(records)) {
      return res.status(400).json({ success: false, error: "Session ID and records array are required." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    // Update session status to CLOSED
    await dbPool.query(
      "UPDATE attendance_sessions SET status = 'CLOSED' WHERE id = ?",
      [sessionId]
    );

    // Delete existing records for this session and insert new ones
    await dbPool.query("DELETE FROM attendance_records WHERE sessionId = ?", [sessionId]);

    const now = new Date().toISOString();
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      const recId = `rec-${sessionId}-${i}-${Date.now()}`;
      await dbPool.query(
        "INSERT INTO attendance_records (id, sessionId, studentId, status, markedAt) VALUES (?, ?, ?, ?, ?)",
        [recId, sessionId, rec.studentId, rec.status, now]
      );
    }

    res.json({ success: true, message: "Attendance records successfully saved to database." });
  } catch (error: any) {
    console.error("Failed to submit attendance records to MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Departments API
app.get("/api/departments", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    await initMySQLTables();
    const [rows]: any = await dbPool.query("SELECT * FROM departments");
    res.json({ success: true, departments: rows });
  } catch (error: any) {
    console.error("Failed to fetch departments from MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/departments", async (req, res) => {
  try {
    const { id, name, code } = req.body;
    if (!id || !name || !code) {
      return res.status(400).json({ success: false, error: "ID, name, and code are required for department." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    await dbPool.query(
      `INSERT INTO departments (id, name, code) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = ?, code = ?`,
      [id, name, code, name, code]
    );

    res.json({ success: true, department: { id, name, code } });
  } catch (error: any) {
    console.error("Failed to save department to MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Classes API
app.get("/api/classes", async (req, res) => {
  try {
    const dbPool = getMySQLPool();
    await initMySQLTables();
    const [rows]: any = await dbPool.query("SELECT * FROM classes");
    res.json({ success: true, classes: rows });
  } catch (error: any) {
    console.error("Failed to fetch classes from MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/classes", async (req, res) => {
  try {
    const { id, departmentId, academicYearId, yearNumber, section } = req.body;
    if (!id || !departmentId || !academicYearId || !yearNumber || !section) {
      return res.status(400).json({ success: false, error: "Missing required class fields." });
    }

    const dbPool = getMySQLPool();
    await initMySQLTables();

    await dbPool.query(
      `INSERT INTO classes (id, departmentId, academicYearId, yearNumber, section) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE departmentId = ?, academicYearId = ?, yearNumber = ?, section = ?`,
      [id, departmentId, academicYearId, yearNumber, section, departmentId, academicYearId, yearNumber, section]
    );

    res.json({ success: true, classRoom: { id, departmentId, academicYearId, yearNumber, section } });
  } catch (error: any) {
    console.error("Failed to save class to MySQL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
