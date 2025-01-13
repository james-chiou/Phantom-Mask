const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

// Load data from JSON files
const pharmaciesData = JSON.parse(fs.readFileSync("./database/pharmacies.json"));
const usersData = JSON.parse(fs.readFileSync("./database/users.json"));

// Promisify db.run for async/await usage
function setupDatabase() {
  return new Promise(async (resolve, reject) => {
    const db = new sqlite3.Database("./database/pharmacy_platform.db");
    const runAsync = promisify(db.run.bind(db));

    try {
      // Start a transaction
      await runAsync("BEGIN TRANSACTION");

      // Create tables
      await runAsync(`CREATE TABLE IF NOT EXISTS Pharmacies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        cash_balance REAL,
        opening_hours TEXT
      )`);

      await runAsync(`CREATE TABLE IF NOT EXISTS Masks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pharmacy_id INTEGER,
        name TEXT,
        price REAL,
        FOREIGN KEY(pharmacy_id) REFERENCES Pharmacies(id)
      )`);

      await runAsync(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        cash_balance REAL
      )`);

      await runAsync(`CREATE TABLE IF NOT EXISTS PurchaseHistories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        pharmacy_name TEXT,
        mask_name TEXT,
        transaction_amount REAL,
        transaction_date TEXT,
        FOREIGN KEY(user_id) REFERENCES Users(id)
      )`);

      // Insert data into Pharmacies
      for (const pharmacy of pharmaciesData) {
        const pharmacyId = await insertPharmacy(db, pharmacy);

        // Insert data into Masks for each pharmacy
        for (const mask of pharmacy.masks) {
          await insertMask(db, pharmacyId, mask);
        }
      }

      // Insert data into Users
      for (const user of usersData) {
        const userId = await insertUser(db, user);

        // Insert data into PurchaseHistories for each user
        for (const history of user.purchaseHistories) {
          await insertPurchaseHistory(db, userId, history);
        }
      }

      // Commit the transaction
      await runAsync("COMMIT");

      // Close the database connection
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Database setup complete.");
          resolve();
        }
      });
    } catch (err) {
      // Rollback the transaction on error
      await runAsync("ROLLBACK");
      reject(err);
    }
  });
}

// Insert Pharmacy
const insertPharmacy = (db, pharmacy) => {
  return new Promise((res, rej) => {
    db.run(
      `INSERT INTO Pharmacies (name, cash_balance, opening_hours) VALUES (?, ?, ?)`,
      [pharmacy.name, pharmacy.cashBalance, pharmacy.openingHours],
      function (err) {
        if (err) {
          rej(err);
        } else {
          res(this.lastID);
        }
      }
    );
  });
};

// Insert Mask
const insertMask = (db, pharmacyId, mask) => {
  return new Promise((res, rej) => {
    db.run(
      `INSERT INTO Masks (pharmacy_id, name, price) VALUES (?, ?, ?)`,
      [pharmacyId, mask.name, mask.price],
      (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }
    );
  });
};

// Insert User
const insertUser = (db, user) => {
  return new Promise((res, rej) => {
    db.run(
      `INSERT INTO Users (name, cash_balance) VALUES (?, ?)`,
      [user.name, user.cashBalance],
      function (err) {
        if (err) {
          rej(err);
        } else {
          res(this.lastID);
        }
      }
    );
  });
};

// Insert PurchaseHistory
const insertPurchaseHistory = (db, userId, history) => {
  return new Promise((res, rej) => {
    let transactionDate = new Date(history.transactionDate);
    const formattedDate = transactionDate.toISOString().slice(0, 19).replace("T", " ");
    db.run(
      `INSERT INTO PurchaseHistories (user_id, pharmacy_name, mask_name, transaction_amount, transaction_date) VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        history.pharmacyName,
        history.maskName,
        history.transactionAmount,
        formattedDate,
      ],
      (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }
    );
  });
};

module.exports = setupDatabase;
