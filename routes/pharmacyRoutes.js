const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/pharmacy_platform.db");

// API 1: List all pharmacies open at a specific time and day of the week
router.get("/open", (req, res) => {
  const { day, time } = req.query;

  // 將星期縮寫對應為數字
  const dayMap = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Thur: 4, // 處理 Thu, Thur的拼寫問題
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  // 檢查查詢的 day 是否有效
  if (!dayMap[day]) {
    return res.status(400).send({ error: "Invalid day input" });
  }

  const queryDayNum = dayMap[day];

  db.all(`SELECT * FROM Pharmacies`, [], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    const openPharmacies = rows.filter((pharmacy) => {
      const openingHours = pharmacy.opening_hours.split(" / ");

      return openingHours.some((period) => {
        // 使用正則表達式分離日期和時間範圍
        const match = period.match(
          /^([\w\s,-]+)\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
        );
        if (!match) return false;

        // 分割日期(例如 Mon, Wed, Fri)
        const days = match[1].split(",").map((d) => d.trim());
        const startTime = match[2];
        const endTime = match[3];

        // 檢查是否是日期範圍（例如 Mon-Fri）
        const isDayInRange = days.some((d) => {
          if (d.includes("-")) {
            const [startDay, endDay] = d
              .split("-")
              .map((day) => dayMap[day.trim()]);
            return queryDayNum >= startDay && queryDayNum <= endDay;
          } else {
            return dayMap[d] === queryDayNum;
          }
        });

        // 檢查時間範圍
        return isDayInRange && time >= startTime && time <= endTime;
      });
    });

    res.send(openPharmacies);
  });
});

// API 2: List all masks sold by a given pharmacy by pharmacy name, sorted by mask name or price
router.get("/:name/masks", (req, res) => {
  const { name } = req.params;
  const { sortBy } = req.query;
  
  // Query to get pharmacy by name
  const pharmacyQuery = "SELECT * FROM Pharmacies WHERE name = ?";
  
  db.get(pharmacyQuery, [name], (err, pharmacy) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    
    if (!pharmacy) {
      res.status(404).send({ error: "Pharmacy not found" });
      return;
    }
    
    const pharmacyId = pharmacy.id;
    
    // Query to get all masks sold by the pharmacy
    let query = `SELECT name, price 
                FROM Masks
                WHERE pharmacy_id = ?`;
    if (sortBy === "name") {
      query += " ORDER BY name";
    } else if (sortBy === "price") {
      query += " ORDER BY price";
    }
    
    db.all(query, [pharmacyId], (err, masks) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }

      const result = masks.map((mask) => ({
        pharmacy: pharmacy.name,
        ...mask
      }));

      res.send(result);
    });
  });
});


// API 3: List all pharmacies with more or less than x mask products within a price range
router.get("/filter", (req, res) => {
  const { minPrice, maxPrice, minMasks, maxMasks } = req.query;
  const minPriceVal = parseFloat(minPrice);
  const maxPriceVal = parseFloat(maxPrice);
  const minMasksVal = parseInt(minMasks, 10);
  const maxMasksVal = parseInt(maxMasks, 10);

  db.all(
    `SELECT Pharmacies.name, COUNT(Masks.id) as maskCount FROM Pharmacies
    LEFT JOIN Masks ON Pharmacies.id = Masks.pharmacy_id
    WHERE Masks.price BETWEEN ? AND ?
    GROUP BY Pharmacies.id
    HAVING maskCount BETWEEN ? AND ?`,
    [minPriceVal, maxPriceVal, minMasksVal, maxMasksVal],
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

// Export the router
module.exports = router;
