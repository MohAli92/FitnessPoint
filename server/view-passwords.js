// View password hashes (for security verification only)
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
  
  console.log('🔐 Password Hashes in Database\n');
  console.log('⚠️  NOTE: Passwords are HASHED (encrypted) for security');
  console.log('   You CANNOT see the original passwords!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  db.all("SELECT id, username, email, password, created_at FROM users ORDER BY id", (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    rows.forEach((row, i) => {
      console.log(`User #${i + 1}:`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Username: ${row.username}`);
      console.log(`  Email: ${row.email}`);
      console.log(`  Password Hash: ${row.password}`);
      console.log(`  Hash Length: ${row.password.length} characters`);
      console.log(`  Created: ${new Date(row.created_at).toLocaleString()}`);
      console.log('');
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Explanation:');
    console.log('   - Passwords are hashed using bcrypt');
    console.log('   - Each hash starts with $2a$ or $2b$');
    console.log('   - Original passwords CANNOT be recovered');
    console.log('   - When you login, the system compares the hash');
    console.log('   - This is a security best practice\n');
    
    db.close();
  });
});
