# How to Run FitnessPoint Website

Follow these steps to get your FitnessPoint website up and running:

## Step 1: Install Dependencies

First, you need to install all the required packages for the entire project (root, server, and client).

**Option A: Install everything at once (Recommended)**
```bash
npm run install-all
```

**Option B: Install separately**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the `server` folder:

1. Navigate to the `server` folder
2. Create a new file named `.env`
3. Add the following content:
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production-to-a-random-string
```

**On Windows (PowerShell):**
```powershell
cd server
New-Item -Path .env -ItemType File
# Then edit the file and add the content above
```

**On Windows (Command Prompt):**
```cmd
cd server
echo PORT=5000 > .env
echo JWT_SECRET=your-secret-key-change-this-in-production-to-a-random-string >> .env
```

**On Mac/Linux:**
```bash
cd server
cat > .env << EOF
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production-to-a-random-string
EOF
```

## Step 3: Run the Application

### Option A: Run Both Server and Client Together (Recommended)

From the root directory:
```bash
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **Frontend development server** on http://localhost:3000

The frontend will automatically open in your browser, or you can manually navigate to:
**http://localhost:3000**

### Option B: Run Server and Client Separately

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm run dev
```
You should see: `Server is running on port 5000`

**Terminal 2 - Start the Frontend Client:**
```bash
cd client
npm start
```
This will automatically open http://localhost:3000 in your browser.

## Step 4: Use the Website

1. **Open your browser** and go to http://localhost:3000
2. **Register a new account** - Click "Register" or navigate to the register page
3. **Fill in your information:**
   - Username, Email, Password (required)
   - Age, Gender, Height, Weight (optional but recommended)
   - Activity Level and Goal (select from dropdowns)
4. **Start exploring:**
   - **Home**: View and create posts to share your fitness journey
   - **Calorie Calculator**: Calculate your daily calorie needs
   - **Fitness Tips**: Get personalized fitness advice and exercises
   - **Profile**: Update your information anytime

## Troubleshooting

### Port Already in Use

If you get an error that port 5000 or 3000 is already in use:

**For the server (port 5000):**
- Change the PORT in `server/.env` to a different number (e.g., `PORT=5001`)
- Or stop the process using port 5000

**For the client (port 3000):**
- The React dev server will automatically ask if you want to use a different port
- Or manually set it: Create `client/.env` and add `PORT=3001`

### Database Errors

If you encounter database errors:
- Delete the `server/fitnesspoint.db` file to reset the database
- Restart the server - it will recreate the database automatically

### Module Not Found Errors

If you see "Cannot find module" errors:
- Make sure you ran `npm run install-all` or installed dependencies in all folders
- Try deleting `node_modules` folders and reinstalling:
  ```bash
  # From root directory
  rm -rf node_modules server/node_modules client/node_modules
  npm run install-all
  ```

### Build Errors

If TypeScript or build errors occur:
- Make sure you're using Node.js version 14 or higher
- Check that all dependencies are installed correctly
- Try clearing the cache and reinstalling

## What's Running?

- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Frontend App**: http://localhost:3000

## Stopping the Application

Press `Ctrl + C` in the terminal where the servers are running to stop them.

## Need Help?

Check the `README.md` file for more detailed information about the project structure and API endpoints.
