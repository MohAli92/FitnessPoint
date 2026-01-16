import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Determine database path - works in both development and production
const getDbPath = () => {
  // In development (ts-node-dev), __dirname is server/src
  // In production (compiled), __dirname is server/dist
  // We want the DB file in server/ directory
  const baseDir = __dirname.includes('dist') 
    ? path.join(__dirname, '..')  // If in dist, go up to server/
    : path.join(__dirname, '..');  // If in src, go up to server/
  
  const dbPath = path.resolve(baseDir, 'fitnesspoint.db');
  const absolutePath = path.resolve(dbPath);
  
  console.log('📁 Database path (relative):', dbPath);
  console.log('📁 Database path (absolute):', absolutePath);
  
  // Ensure directory exists
  const dbDir = path.dirname(absolutePath);
  if (!fs.existsSync(dbDir)) {
    console.log('📂 Creating database directory:', dbDir);
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Check if we can write to the directory
  try {
    const testFile = path.join(dbDir, '.test-write');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Database directory is writable');
  } catch (err) {
    console.error('❌ Database directory is not writable:', err);
    throw new Error(`Cannot write to database directory: ${dbDir}`);
  }
  
  return absolutePath;
};

const dbPath = getDbPath();
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    console.error('   Path:', dbPath);
    console.error('   Error details:', err.message);
    throw err;
  } else {
    console.log('✅ Database connection opened successfully');
    console.log('   File exists:', fs.existsSync(dbPath));
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log('   File size:', stats.size, 'bytes');
    }
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Helper functions with proper promise handling
export const dbRun = (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error | null, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Populate foods table with initial data
const populateFoods = async () => {
  const foods = [
    // Proteins - Halal, Kosher options
    { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving_size: '100g', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 12, serving_size: '100g', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Turkey Breast', calories: 135, protein: 30, carbs: 0, fat: 1, serving_size: '100g', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Tuna (canned in water)', calories: 116, protein: 26, carbs: 0, fat: 0.8, serving_size: '100g', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving_size: '2 large eggs', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving_size: '100g', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving_size: '100g', dietary_tags: 'halal,kosher,high_protein,gluten_free' },
    { name: 'Lentils', calories: 116, protein: 9, carbs: 20, fat: 0.4, serving_size: '100g cooked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,high_protein' },
    { name: 'Chickpeas', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, serving_size: '100g cooked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Black Beans', calories: 132, protein: 8.9, carbs: 24, fat: 0.5, serving_size: '100g cooked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Tempeh', calories: 193, protein: 19, carbs: 9, fat: 11, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,high_protein' },
    
    // Grains & Carbs
    { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving_size: '100g cooked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, serving_size: '100g cooked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,high_protein' },
    { name: 'Oats', calories: 68, protein: 2.4, carbs: 12, fat: 1.4, serving_size: '100g cooked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving_size: '100g baked', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fat: 4.2, serving_size: '100g', dietary_tags: 'vegetarian,halal,kosher' },
    
    // Vegetables
    { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb' },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb' },
    { name: 'Kale', calories: 49, protein: 4.3, carbs: 9, fat: 0.9, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb' },
    { name: 'Bell Peppers', calories: 31, protein: 1, carbs: 7, fat: 0.3, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb' },
    { name: 'Carrots', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    
    // Fruits
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
    { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb' },
    { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb' },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,low_carb,keto' },
    
    // Nuts & Seeds
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,keto,high_protein' },
    { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fat: 65, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,keto' },
    { name: 'Chia Seeds', calories: 486, protein: 17, carbs: 42, fat: 31, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,high_protein' },
    { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,high_protein' },
    
    // Dairy & Alternatives
    { name: 'Almond Milk', calories: 17, protein: 0.6, carbs: 1.5, fat: 1.2, serving_size: '100ml', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,lactose_free' },
    { name: 'Oat Milk', calories: 47, protein: 1, carbs: 7, fat: 1.5, serving_size: '100ml', dietary_tags: 'vegan,vegetarian,halal,kosher,lactose_free' },
    { name: 'Coconut Milk', calories: 230, protein: 2.3, carbs: 6, fat: 24, serving_size: '100ml', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,lactose_free,keto' },
    { name: 'Mozzarella Cheese', calories: 300, protein: 22, carbs: 2.2, fat: 22, serving_size: '100g', dietary_tags: 'vegetarian,halal,kosher,gluten_free,keto,high_protein' },
    
    // Other
    { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fat: 100, serving_size: '100ml', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free,keto' },
    { name: 'Hummus', calories: 166, protein: 8, carbs: 14, fat: 10, serving_size: '100g', dietary_tags: 'vegan,vegetarian,halal,kosher,gluten_free' },
  ];

  for (const food of foods) {
    await dbRun(
      'INSERT INTO foods (name, calories, protein, carbs, fat, serving_size, dietary_tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [food.name, food.calories, food.protein, food.carbs, food.fat, food.serving_size, food.dietary_tags]
    );
  }
  console.log('Foods database populated');
};

export const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        height REAL,
        weight REAL,
        activity_level TEXT,
        goal TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Posts table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Comments table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Likes table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Follows table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS follows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        follower_id INTEGER NOT NULL,
        following_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Foods table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        serving_size TEXT NOT NULL,
        dietary_tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if foods table is empty and populate with initial data
    const foodCount: any = await dbGet('SELECT COUNT(*) as count FROM foods');
    if (foodCount.count === 0) {
      console.log('📦 Populating foods table...');
      await populateFoods();
    } else {
      console.log(`✅ Foods table already has ${foodCount.count} items`);
    }

    // Verify database is working by checking if we can query
    const userCount: any = await dbGet('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Database initialized successfully! (${userCount.count} users in database)`);
    
    // Verify database file exists and is accessible
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log(`✅ Database file verified: ${stats.size} bytes, readable: ${fs.constants.R_OK}, writable: ${fs.constants.W_OK}`);
    } else {
      console.warn('⚠️  Warning: Database file not found after initialization');
    }
  } catch (error: any) {
    console.error('❌ Error initializing database:', error);
    console.error('   Database path:', dbPath);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    throw error;
  }
};

export { db };
