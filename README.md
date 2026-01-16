# FitnessPoint

A comprehensive fitness awareness website with social features, calorie calculator, personalized food suggestions, and fitness tips and exercises.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Social Feed**: Post, like, and comment on fitness journeys to encourage each other
  - Edit and delete your own posts
  - Upload photos with posts
- **Calorie Calculator**: Calculate your daily calorie needs and macronutrient targets based on your goals
- **Food Suggestions**: Get personalized meal suggestions based on your calorie needs and dietary preferences (Halal, Vegan, Vegetarian, Lactose-Free, Gluten-Free, Keto, Paleo, Low-Carb, High-Protein)
- **Fitness Tips & Exercises**: Get personalized fitness advice and exercise recommendations
- **User Profiles**: Manage your personal information and fitness goals

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- SQLite database
- JWT authentication
- bcrypt for password hashing

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Heroicons for icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### GitHub Codespaces Setup (Automatic)

When you open this project in GitHub Codespaces:

1. **Dependencies are installed automatically** - All required packages (root, server, and client) will be installed automatically when the container is created.

2. **Ports are forwarded automatically** - Ports 3000 (Frontend) and 5000 (Backend) are automatically forwarded and accessible via public URLs.

3. **API URL is detected automatically** - The frontend automatically detects the Codespace environment and connects to the backend using the correct external URL. No manual configuration needed!

4. **Start the servers**:
   ```bash
   npm run dev
   ```
   - Run this command from the project root (not inside `client` or `server`)
   - No need to run `npm start` manually; `npm run dev` starts both backend (5000) and frontend (3000) together

5. **Access the application**:
   - Click on the "Frontend (React)" port notification or go to the Ports tab
   - The frontend will automatically connect to the backend using the correct Codespace URL
   - No need to manually configure any URLs!

### Local Development Setup

### Installation

1. Install all dependencies (root, server, and client):
```bash
npm run install-all
```

2. Start the development servers:
```bash
npm run dev
```
   - Run this command from the project root (not inside `client` or `server`)
   - No need to run `npm start` manually; `npm run dev` starts both backend (5000) and frontend (3000) together

This will start both the backend server (port 5000) and the frontend development server (port 3000).

### Manual Setup (Alternative)

If you prefer to set up manually:

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

4. Start the backend server:
```bash
cd server
npm run dev
```

5. In a new terminal, start the frontend:
```bash
cd client
npm start
```

## Environment Variables

Create a `.env` file in the `server` directory:

```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

## Project Structure

```
FitnessPoint/
├── server/                 # Backend code
│   ├── src/
│   │   ├── index.ts       # Server entry point
│   │   ├── database.ts    # Database initialization
│   │   ├── middleware/    # Auth middleware
│   │   └── routes/        # API routes
│   └── package.json
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── App.tsx        # Main app component
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create a new post (with optional image)
- `PUT /api/posts/:id` - Update a post (owner only)
- `DELETE /api/posts/:id` - Delete a post (owner only)
- `POST /api/posts/:id/like` - Like/unlike a post
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add a comment to a post

### Calories
- `POST /api/calories/calculate` - Calculate calorie needs
- `POST /api/calories/suggest-foods` - Get food suggestions based on calorie needs and dietary preferences

### Fitness
- `GET /api/fitness/tips?goal=lose|maintain|gain` - Get fitness tips
- `GET /api/fitness/exercises?goal=lose|maintain|gain` - Get exercises

## Database Schema

The application uses SQLite with the following tables:
- `users` - User accounts and profiles
- `posts` - Social media posts (with optional image_url)
- `comments` - Comments on posts
- `likes` - Likes on posts
- `follows` - User follow relationships
- `foods` - Food database with nutritional information and dietary tags

## License

MIT
