const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'fitnesspoint.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Tables to clear
const tables = ['users', 'posts', 'comments', 'likes', 'follows'];

let clearedCount = 0;

tables.forEach((tableName) => {
  db.run(`DELETE FROM ${tableName}`, (err) => {
    if (err) {
      console.error(`❌ Error clearing ${tableName}:`, err.message);
    } else {
      clearedCount++;
      console.log(`✅ Cleared table: ${tableName}`);
    }

    // Close database after all operations
    if (clearedCount === tables.length) {
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('\n✅ Database cleared successfully!');
          console.log('📊 All user data (emails, passwords, posts, etc.) has been deleted.');
        }
        process.exit(0);
      });
    }
  });
});
