import express from 'express';
import { dbGet, dbAll, dbRun } from '../database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user: any = await dbGet('SELECT id, username, email, age, gender, height, weight, activity_level, goal, created_at FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { age, gender, height, weight, activity_level, goal } = req.body;
    await dbRun(
      'UPDATE users SET age = ?, gender = ?, height = ?, weight = ?, activity_level = ?, goal = ? WHERE id = ?',
      [age, gender, height, weight, activity_level, goal, req.userId]
    );
    const user: any = await dbGet('SELECT id, username, email, age, gender, height, weight, activity_level, goal FROM users WHERE id = ?', [req.userId]);
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user: any = await dbGet('SELECT id, username, email, age, gender, height, weight, activity_level, goal, created_at FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Follow user
router.post('/:id/follow', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const followingId = parseInt(req.params.id);
    if (followingId === req.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    await dbRun('INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [req.userId, followingId]);
    res.json({ message: 'Followed successfully' });
  } catch (error: any) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unfollow user
router.delete('/:id/follow', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [req.userId, req.params.id]);
    res.json({ message: 'Unfollowed successfully' });
  } catch (error: any) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
