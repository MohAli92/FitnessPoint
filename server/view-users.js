// Script to view all users (emails and usernames) from the database
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'fitnesspoint.db');

console.log('📧 Viewing all registered users...');
console.log('📁 Database path:', dbPath);
console.log('');

if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file does not exist');
  console.log('   Please start the server first to create the database');
  process.exit(0);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  
  // Get all users
  db.all("SELECT id, username, email, age, gender, height, weight, activity_level, goal, created_at FROM users ORDER BY id", (err, users) => {
    if (err) {
      console.error('❌ Error querying users:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (users.length === 0) {
      console.log('📊 No users found in database');
      db.close();
      process.exit(0);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Total Users: ${users.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    // Display each user
    users.forEach((user, index) => {
      console.log(`📋 User #${user.id}:`);
      console.log(`   👤 Username: ${user.username}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🎂 Age: ${user.age || 'Not set'}`);
      console.log(`   ⚥ Gender: ${user.gender || 'Not set'}`);
      console.log(`   📏 Height: ${user.height ? user.height + ' cm' : 'Not set'}`);
      console.log(`   ⚖️  Weight: ${user.weight ? user.weight + ' kg' : 'Not set'}`);
      console.log(`   🏃 Activity Level: ${user.activity_level || 'Not set'}`);
      console.log(`   🎯 Goal: ${user.goal || 'Not set'}`);
      console.log(`   📅 Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Users list complete');
    db.close();
  });
});
