const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/apply", async (req, res) => {
  try {
    const { name, email, phone, dob, state } = req.body;

    if (!name || !email || !phone || !dob || !state) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const reference =
      "GHG2026-" +
      Math.random().toString(36).slice(2, 8).toUpperCase();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS grant_applications (
        id SERIAL PRIMARY KEY,
        reference VARCHAR(50) UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        dob DATE NOT NULL,
        state TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(
      `INSERT INTO grant_applications
       (reference, name, email, phone, dob, state)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [reference, name, email, phone, dob, state]
    );

    res.json({
      success: true,
      reference
    });
  } catch (error) {
    console.error("Application error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit application. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Greater High Grant server running on port ${PORT}`);
});
