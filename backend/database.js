const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'raksha.db');

let db;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        sex TEXT NOT NULL,
        county TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        status TEXT DEFAULT 'pending',
        approved_at DATETIME,
        approved_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_location_lat REAL,
        last_location_lng REAL,
        last_location_updated DATETIME
      )`);

      // SOS Alerts table
      db.run(`CREATE TABLE IF NOT EXISTS sos_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        responded_by INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Admin users table
      db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          reject(err);
          return;
        }
        // Create default admin if doesn't exist
        createDefaultAdmin().then(resolve).catch(reject);
      });
    });
  });
};

const createDefaultAdmin = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM admins WHERE email = ?", ["admin@raksha.ie"], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (!row) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
          "INSERT INTO admins (email, password, name) VALUES (?, ?, ?)",
          ["admin@raksha.ie", hashedPassword, "Admin"],
          (err) => {
            if (err) reject(err);
            else {
              console.log('Default admin created: admin@raksha.ie / admin123');
              resolve();
            }
          }
        );
      } else {
        resolve();
      }
    });
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = {
  init,
  query,
  get,
  run,
  db
};

