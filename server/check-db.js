// Quick script to check database status
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'fitnesspoint.db');

console.log('🔍 Checking database...');
console.log('📁 Database path:', dbPath);
console.log('📁 Absolute path:', path.resolve(dbPath));

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log('✅ Database file exists');
  console.log('   Size:', stats.size, 'bytes');
  console.log('   Created:', stats.birthtime);
  console.log('   Modified:', stats.mtime);
  
  // Try to open database
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('❌ Cannot open database:', err.message);
      process.exit(1);
    } else {
      console.log('✅ Database is readable');
      
      // Check tables
      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
          console.error('❌ Error querying tables:', err.message);
        } else {
          console.log('📊 Tables found:', tables.length);
          tables.forEach(table => {
            console.log('   -', table.name);
          });
        }
        
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('✅ Database check complete');
          }
          process.exit(0);
        });
      });
    }
  });
} else {
  console.log('❌ Database file does not exist');
  console.log('   This is normal if the server has not been started yet');
  console.log('   The database will be created automatically when you start the server');
  process.exit(0);
}
