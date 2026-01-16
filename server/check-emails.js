// Direct SQL query to check all emails
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'fitnesspoint.db');

if (!fs.existsSync(dbPath)) {
  console.log('❌ Database does not exist');
  process.exit(0);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  console.log('🔍 Checking ALL emails in database...\n');
  
  // Get all emails directly
  db.all("SELECT id, email, username, created_at FROM users ORDER BY id", (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log(`📊 Total users found: ${rows.length}\n`);
    
    if (rows.length === 0) {
      console.log('No users in database');
    } else {
      rows.forEach((row, i) => {
        console.log(`User #${i + 1}:`);
        console.log(`  ID: ${row.id}`);
        console.log(`  Email: ${row.email}`);
        console.log(`  Username: ${row.username}`);
        console.log(`  Created: ${new Date(row.created_at).toLocaleString()}`);
        console.log('');
      });
    }
    
    // Also check for yahoo emails specifically
    db.all("SELECT email FROM users WHERE email LIKE '%yahoo%'", (err, yahooRows) => {
      if (err) {
        console.error('❌ Error:', err.message);
      } else {
        console.log(`\n📧 Yahoo emails found: ${yahooRows.length}`);
        if (yahooRows.length > 0) {
          yahooRows.forEach(row => console.log(`  - ${row.email}`));
        }
      }
      
      db.close();
    });
  });
});
