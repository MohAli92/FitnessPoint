// Deep search for yahoo emails in database
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
  
  console.log('🔍 Searching for Yahoo emails in database...\n');
  console.log('📁 Database:', dbPath);
  console.log('');
  
  // Search for yahoo (case insensitive)
  db.all("SELECT * FROM users WHERE LOWER(email) LIKE '%yahoo%'", (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log(`📧 Yahoo emails found: ${rows.length}\n`);
    
    if (rows.length === 0) {
      console.log('❌ No Yahoo emails found in database');
      console.log('\n🔍 Let me check ALL emails in database:\n');
      
      // Show all emails
      db.all("SELECT id, email, username, created_at FROM users ORDER BY id", (err, allRows) => {
        if (err) {
          console.error('❌ Error:', err.message);
        } else {
          console.log(`📊 Total users: ${allRows.length}\n`);
          allRows.forEach((row, i) => {
            console.log(`User #${i + 1}:`);
            console.log(`  ID: ${row.id}`);
            console.log(`  Email: ${row.email}`);
            console.log(`  Username: ${row.username}`);
            console.log(`  Created: ${new Date(row.created_at).toLocaleString()}`);
            console.log('');
          });
        }
        db.close();
      });
    } else {
      rows.forEach((row, i) => {
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📋 Yahoo User #${i + 1}:`);
        console.log(`   ID: ${row.id}`);
        console.log(`   Email: ${row.email}`);
        console.log(`   Username: ${row.username}`);
        console.log(`   Age: ${row.age || 'Not set'}`);
        console.log(`   Gender: ${row.gender || 'Not set'}`);
        console.log(`   Height: ${row.height || 'Not set'}`);
        console.log(`   Weight: ${row.weight || 'Not set'}`);
        console.log(`   Activity: ${row.activity_level || 'Not set'}`);
        console.log(`   Goal: ${row.goal || 'Not set'}`);
        console.log(`   Created: ${new Date(row.created_at).toLocaleString()}`);
        console.log('');
      });
      db.close();
    }
  });
});
