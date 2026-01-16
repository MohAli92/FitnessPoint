# Testing API Connection in Codespace

## Quick Test Steps

### 1. Test Backend Health Endpoint

In your Codespace terminal, run:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "FitnessPoint API is running",
  "database": {
    "connected": true,
    "users": 0
  }
}
```

### 2. Test Registration Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

You should get a response with a token and user data.

### 3. Test Login Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 4. Check Frontend API URL

1. Open your browser to the frontend (port 3000)
2. Open Developer Tools (F12)
3. Go to Console tab
4. You should see: `🌐 API URL: ...`
5. Check what URL it shows

### 5. Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to register/login
4. Look for requests to `/api/auth/register` or `/api/auth/login`
5. Check:
   - Request URL (should point to port 5000)
   - Response status (200 = success, 400/500 = error)
   - Response body (shows error message if failed)

## Common Issues

### Issue: Frontend can't reach backend

**Symptom**: Network requests fail with CORS or connection errors

**Solution**: 
- Check that port 5000 is forwarded in Codespace
- Verify the API URL in browser console
- Make sure both servers are running

### Issue: "Invalid credentials" on login

**Symptom**: Login fails even with correct password

**Solution**:
- Make sure you registered first
- Check if user exists: `curl http://localhost:5000/api/health`
- Try registering a new account

### Issue: Database errors

**Symptom**: Server logs show database errors

**Solution**:
- Check database file exists: `ls -la server/fitnesspoint.db`
- Check database: `cd server && npm run check-db`
- Delete and recreate: `rm server/fitnesspoint.db && npm start`

## Verify Everything Works

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ Database initialized (0 users)
4. ✅ Ports forwarded in Codespace
5. ✅ API URL correctly configured in frontend
6. ✅ Can register new user
7. ✅ Can login with registered user
