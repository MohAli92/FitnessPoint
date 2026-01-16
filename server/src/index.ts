import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import calorieRoutes from './routes/calories';
import fitnessRoutes from './routes/fitness';
import chatbotRoutes from './routes/chatbot';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow Codespace origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for local development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow all Codespace/GitHub Dev origins
    if (origin.includes('.app.github.dev') || 
        origin.includes('.github.dev') || 
        origin.includes('preview.app.github.dev')) {
      return callback(null, true);
    }
    
    // Allow all origins for now (can be restricted later)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { dbGet } = await import('./database');
    const result: any = await dbGet('SELECT COUNT(*) as count FROM users');
    res.json({ 
      status: 'ok', 
      message: 'FitnessPoint API is running',
      database: {
        connected: true,
        users: result.count
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/calories', calorieRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized successfully!');
    
    // Listen on 0.0.0.0 to accept connections from Codespace forwarded ports
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🌐 Server listening on 0.0.0.0:${PORT} (accessible from Codespace forwarded ports)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
