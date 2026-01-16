// Export users data to a text file
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'fitnesspoint.db');
const outputPath = path.join(__dirname, 'users-data.txt');

if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file does not exist');
  process.exit(0);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  
  db.all("SELECT id, username, email, age, gender, height, weight, activity_level, goal, created_at FROM users ORDER BY id", (err, users) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    let content = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += '📧 REGISTERED USERS DATA\n';
    content += `📅 Exported: ${new Date().toLocaleString()}\n`;
    content += `👥 Total Users: ${users.length}\n`;
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    users.forEach((user) => {
      content += `📋 User #${user.id}:\n`;
      content += `   👤 Username: ${user.username}\n`;
      content += `   📧 Email: ${user.email}\n`;
      content += `   🎂 Age: ${user.age || 'Not set'}\n`;
      content += `   ⚥ Gender: ${user.gender || 'Not set'}\n`;
      content += `   📏 Height: ${user.height ? user.height + ' cm' : 'Not set'}\n`;
      content += `   ⚖️  Weight: ${user.weight ? user.weight + ' kg' : 'Not set'}\n`;
      content += `   🏃 Activity: ${user.activity_level || 'Not set'}\n`;
      content += `   🎯 Goal: ${user.goal || 'Not set'}\n`;
      content += `   📅 Created: ${new Date(user.created_at).toLocaleString()}\n\n`;
    });
    
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ Data exported to: ${outputPath}`);
    console.log(`📊 Total users: ${users.length}`);
    db.close();
  });
});
