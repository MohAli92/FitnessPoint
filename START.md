# How to Start FitnessPoint

## Quick Start (If ports are free)

Simply run:
```powershell
npm run dev
```

The website will open automatically in your browser at http://localhost:3000

---

## If You Get "Port Already in Use" Error

If you see errors like:
- `Error: listen EADDRINUSE: address already in use :::5000`
- `Something is already running on port 3000`

### Option 1: Use the Script (Easiest)

Run the PowerShell script:
```powershell
.\stop-servers.ps1
```

Then start the servers:
```powershell
npm run dev
```

### Option 2: Manual Method

**Step 1: Find the processes**
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

**Step 2: Kill them (replace <PID> with the number you found)**
```powershell
taskkill /F /PID <PID>
```

**Step 3: Start the servers**
```powershell
npm run dev
```

---

## To Stop the Website

Press `Ctrl + C` in the terminal (you may need to press it twice)

---

## Summary

**Normal startup:**
```powershell
npm run dev
```

**If ports are busy:**
```powershell
.\stop-servers.ps1
npm run dev
```

**To stop:**
Press `Ctrl + C`

