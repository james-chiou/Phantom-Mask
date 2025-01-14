const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/pharmacy_platform.db");

// API 4: Top x users by total transaction amount within a date range
router.get("/top", (req, res) => {
  const { startDate, endDate, limit } = req.query;

  db.all(
    `SELECT DISTINCT Users.name, SUM(PurchaseHistories.transaction_amount) as totalAmount
    FROM Users
    JOIN PurchaseHistories ON Users.id = PurchaseHistories.user_id
    WHERE DATE(SUBSTR(PurchaseHistories.transaction_date, 1, 10)) BETWEEN DATE(?) AND DATE(?)
    GROUP BY Users.id
    ORDER BY totalAmount DESC
    LIMIT ?`,
    [startDate, endDate, limit],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      if (rows.length === 0) {
        res.status(404).send({ message: "No results were found to match the criteria." });
        return;
      }
      res.send(rows);
    }
  );
});

// API 7: Process a user purchasing a mask from a pharmacy
router.post("/purchase", (req, res) => {
  const { userId, pharmacyId, maskId, quantity } = req.body;
  db.serialize(() => {
    db.get(`SELECT * FROM Users WHERE id = ?`, [userId], (err, user) => {
      if (err || !user) {
        res.status(404).send({ error: "User not found" });
        return;
      }
      db.get(
        `SELECT * FROM Masks WHERE id = ? AND pharmacy_id = ?`,
        [maskId, pharmacyId],
        (err, mask) => {
          if (err || !mask) {
            res.status(404).send({ error: "Mask not found in this pharmacy" });
            return;
          }
          const totalCost = Math.ceil(mask.price * quantity * 100) / 100;
          if (user.cash_balance < totalCost) {
            res.status(400).send({ error: "Insufficient balance" });
            return;
          }
          db.run(
            `UPDATE Users SET cash_balance = cash_balance - ? WHERE id = ?`,
            [totalCost, userId]
          );
          db.run(
            `UPDATE Pharmacies SET cash_balance = cash_balance + ? WHERE id = ?`,
            [totalCost, pharmacyId]
          );
          res.send({ message: "Purchase successful", totalCost });
        }
      );
    });
  });
});

// Export the router
module.exports = router;
