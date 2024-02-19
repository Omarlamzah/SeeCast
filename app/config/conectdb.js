const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");


const { app } = require('electron');

// Handle file paths correctly
const userDataPath = app.getPath('userData');
 
const dbPath = path.join(userDataPath, 'db.db');

//const dbPath = path.join(__dirname, "../db/db.db");

// Check if the database file exists
const dbExists = fs.existsSync(dbPath);

// If the database file doesn't exist, create it
if (!dbExists) {
    fs.closeSync(fs.openSync(dbPath, 'w'));
    console.log("New database created at", dbPath);
}

// Establish connection to the database
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Create the 'question' table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS question (
        id INTEGER PRIMARY KEY,
        text TEXT
    )
`);


// Create the 'question' table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS question (
        id INTEGER PRIMARY KEY,
        text TEXT
    )
`);

// Export the database object
exports.db = db;
