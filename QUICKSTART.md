# Quick Start Guide

## Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
   This will install dependencies for the root, server, and client.

2. **Set up environment variables:**
   - Create a `.env` file in the `server` directory
   - Add the following:
     ```
     PORT=5000
     JWT_SECRET=your-secret-key-change-this-in-production
     ```

## Running the Application

### Development Mode (Recommended)

Run both server and client together:
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Run Separately

**Backend only:**
```bash
cd server
npm run dev
```

**Frontend only:**
```bash
cd client
npm start
```

## First Steps

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Complete your profile with your fitness information
4. Start exploring:
   - **Home**: View and create posts to share your fitness journey
   - **Calorie Calculator**: Calculate your daily calorie needs
   - **Fitness Tips**: Get personalized tips and exercises
   - **Profile**: Update your information

## Features

✅ User registration and authentication  
✅ Social feed with posts, likes, and comments  
✅ Calorie calculator with macro breakdown  
✅ Personalized fitness tips and exercises  
✅ User profiles with goal tracking  

## Troubleshooting

- **Port already in use**: Change the PORT in server/.env or kill the process using the port
- **Database errors**: Delete `server/fitnesspoint.db` to reset the database
- **Module not found**: Run `npm run install-all` again
