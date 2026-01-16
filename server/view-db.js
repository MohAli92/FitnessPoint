// Script to view all data from the database
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'fitnesspoint.db');

console.log('🔍 Viewing database data...');
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
  
  // Get all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
    if (err) {
      console.error('❌ Error querying tables:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (tables.length === 0) {
      console.log('📊 No tables found in database');
      db.close();
      process.exit(0);
    }
    
    console.log('📊 Tables found:', tables.length);
    console.log('');
    
    // View data from each table
    let tablesProcessed = 0;
    
    tables.forEach((table, index) => {
      const tableName = table.name;
      
      // Skip sqlite system tables
      if (tableName.startsWith('sqlite_')) {
        tablesProcessed++;
        if (tablesProcessed === tables.length) {
          db.close();
        }
        return;
      }
      
      db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) {
          console.error(`❌ Error querying ${tableName}:`, err.message);
        } else {
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          console.log(`📋 Table: ${tableName}`);
          console.log(`   Rows: ${rows.length}`);
          console.log('');
          
          if (rows.length === 0) {
            console.log('   (No data)');
          } else {
            // Display column names
            const columns = Object.keys(rows[0]);
            console.log('   Columns:', columns.join(', '));
            console.log('');
            
            // Display each row
            rows.forEach((row, rowIndex) => {
              console.log(`   Row ${rowIndex + 1}:`);
              columns.forEach(col => {
                let value = row[col];
                // Hide password for security
                if (col === 'password') {
                  value = '***HIDDEN***';
                }
                // Format dates nicely
                if (col === 'created_at' && value) {
                  value = new Date(value).toLocaleString();
                }
                console.log(`      ${col}: ${value}`);
              });
              console.log('');
            });
          }
          console.log('');
        }
        
        tablesProcessed++;
        if (tablesProcessed === tables.length) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('✅ Database view complete');
          db.close();
        }
      });
    });
  });
});
