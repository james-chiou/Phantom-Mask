// Import necessary modules
const express = require("express");
const cors = require("cors");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const userRoutes = require("./routes/userRoutes");
const sqlite3 = require("sqlite3").verbose();
const setupDatabase = require("./database/setup");

const db = new sqlite3.Database("./database/pharmacy_platform.db");

// Initialize the app and database
const app = express();

// check db is exist or not
const fs = require("fs");

if (!fs.existsSync("./database/pharmacy_platform.db")) {
  console.error(
    'Database not found. Please run "node database/setup.js" to create the database.'
  );
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Use routes
app.use("/pharmacies", pharmacyRoutes);
app.use("/users", userRoutes);

// API 5: The total amount of masks and dollar value of transactions within a date range.
app.get("/transactions", (req, res) => {
  const { startDay, endDay } = req.query;
  db.get(
    `SELECT pharmacy_name, mask_name,COUNT(*) as totalMasks, SUM(transaction_amount) as totalValue
    FROM PurchaseHistories
    WHERE DATE(SUBSTR(transaction_date, 1, 10)) BETWEEN DATE(?) AND DATE(?)`,
    [startDay, endDay],
    (err, row) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      if (rows.length === 0) {
        res.status(404).send({ message: "No results were found to match the criteria." });
        return;
      }
      res.send(row);
    }
  );
});

// API 6: Search for pharmacies or masks by name
app.get("/search", (req, res) => {
  const { name } = req.query;

  // 搜尋符合藥局名稱的資料
  db.all(
    `SELECT DISTINCT name, opening_hours
     FROM Pharmacies
     WHERE name LIKE ?
     ORDER BY name`,
    [`%${name}%`],
    (err, pharmacyRows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }

      // 搜尋符合口罩名稱的資料
      db.all(
        `SELECT DISTINCT m.name AS mask, p.name AS pharmacy, opening_hours, price
         FROM Masks m
         JOIN Pharmacies p ON m.pharmacy_id = p.id
         WHERE m.name LIKE ?
         ORDER BY price`,
        [`%${name}%`],
        (err, maskRows) => {
          if (err) {
            res.status(500).send({ error: err.message });
            return;
          }

          if (pharmacyRows.length === 0 && maskRows.length === 0) {
            res.status(404).send({ message: "No results were found to match the input." });
            return;
          }

          // 合併兩個結果並回傳
          res.json({
            pharmacies: pharmacyRows,
            masks: maskRows,
          });
        }
      );
    }
  );
});

async function startServer() {
  try {
    // Wait for the database setup to complete
    await setupDatabase();

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();