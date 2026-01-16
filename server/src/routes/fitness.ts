import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get fitness tips based on goal
router.get('/tips', authenticateToken, (req, res) => {
  try {
    const goal = req.query.goal as string || 'maintain';

    const tips: { [key: string]: any[] } = {
      lose: [
        {
          title: 'Create a Calorie Deficit',
          content: 'Aim for a 500-calorie deficit per day to lose 1 pound per week safely and sustainably.',
          category: 'Nutrition'
        },
        {
          title: 'Focus on Protein',
          content: 'High-protein meals help you feel full longer and preserve muscle mass during weight loss.',
          category: 'Nutrition'
        },
        {
          title: 'Cardio and Strength Training',
          content: 'Combine cardio for calorie burn with strength training to maintain muscle mass.',
          category: 'Exercise'
        },
        {
          title: 'Stay Hydrated',
          content: 'Drink plenty of water throughout the day. Sometimes thirst is mistaken for hunger.',
          category: 'Lifestyle'
        },
        {
          title: 'Get Enough Sleep',
          content: 'Aim for 7-9 hours of sleep per night. Poor sleep can disrupt hunger hormones.',
          category: 'Lifestyle'
        }
      ],
      gain: [
        {
          title: 'Calorie Surplus',
          content: 'Consume 300-500 calories above your TDEE to gain weight in a controlled manner.',
          category: 'Nutrition'
        },
        {
          title: 'Prioritize Strength Training',
          content: 'Focus on compound movements like squats, deadlifts, and bench presses for muscle growth.',
          category: 'Exercise'
        },
        {
          title: 'Protein is Key',
          content: 'Consume 1.6-2.2g of protein per kg of body weight to support muscle synthesis.',
          category: 'Nutrition'
        },
        {
          title: 'Eat Frequently',
          content: 'Have 5-6 meals per day to ensure you meet your calorie goals without feeling overly full.',
          category: 'Nutrition'
        },
        {
          title: 'Track Progress',
          content: 'Measure your weight weekly and adjust calories based on your progress rate.',
          category: 'Lifestyle'
        }
      ],
      maintain: [
        {
          title: 'Balance Your Calories',
          content: 'Match your calorie intake to your TDEE to maintain your current weight.',
          category: 'Nutrition'
        },
        {
          title: 'Stay Active',
          content: 'Engage in regular physical activity to maintain muscle mass and cardiovascular health.',
          category: 'Exercise'
        },
        {
          title: 'Nutrient-Dense Foods',
          content: 'Focus on whole foods rich in vitamins, minerals, and fiber for optimal health.',
          category: 'Nutrition'
        },
        {
          title: 'Consistent Routine',
          content: 'Maintain a regular eating and exercise schedule to support your metabolism.',
          category: 'Lifestyle'
        },
        {
          title: 'Listen to Your Body',
          content: 'Pay attention to hunger and fullness cues to maintain a healthy relationship with food.',
          category: 'Lifestyle'
        }
      ]
    };

    res.json({ tips: tips[goal.toLowerCase()] || tips.maintain, goal });
  } catch (error: any) {
    console.error('Get tips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get exercises based on goal
router.get('/exercises', authenticateToken, (req, res) => {
  try {
    const goal = req.query.goal as string || 'maintain';

    const exercises: { [key: string]: any[] } = {
      lose: [
        {
          name: 'HIIT Cardio',
          description: 'High-intensity interval training burns calories efficiently and boosts metabolism.',
          sets: '3-4 rounds',
          reps: '30 seconds on, 30 seconds off',
          category: 'Cardio'
        },
        {
          name: 'Bodyweight Circuit',
          description: 'Combine push-ups, squats, lunges, and planks for a full-body workout.',
          sets: '3-4 circuits',
          reps: '12-15 reps each',
          category: 'Strength'
        },
        {
          name: 'Running/Jogging',
          description: 'Aim for 30-45 minutes of moderate-paced running to burn calories.',
          sets: '1',
          reps: '30-45 minutes',
          category: 'Cardio'
        },
        {
          name: 'Burpees',
          description: 'Full-body exercise that combines strength and cardio.',
          sets: '3-4',
          reps: '10-15 reps',
          category: 'Cardio'
        }
      ],
      gain: [
        {
          name: 'Barbell Squats',
          description: 'King of leg exercises. Builds lower body strength and mass.',
          sets: '4-5',
          reps: '6-8 reps',
          category: 'Strength'
        },
        {
          name: 'Deadlifts',
          description: 'Compound movement targeting back, glutes, and hamstrings.',
          sets: '4-5',
          reps: '5-6 reps',
          category: 'Strength'
        },
        {
          name: 'Bench Press',
          description: 'Primary chest exercise for building upper body muscle.',
          sets: '4-5',
          reps: '6-8 reps',
          category: 'Strength'
        },
        {
          name: 'Pull-Ups',
          description: 'Excellent for building back and bicep strength.',
          sets: '4-5',
          reps: '6-10 reps',
          category: 'Strength'
        },
        {
          name: 'Overhead Press',
          description: 'Builds shoulders and triceps while improving core stability.',
          sets: '4',
          reps: '6-8 reps',
          category: 'Strength'
        }
      ],
      maintain: [
        {
          name: 'Full Body Workout',
          description: 'Combine strength and cardio exercises for overall fitness.',
          sets: '3-4',
          reps: '10-12 reps',
          category: 'Mixed'
        },
        {
          name: 'Yoga',
          description: 'Improves flexibility, balance, and mental well-being.',
          sets: '1',
          reps: '30-60 minutes',
          category: 'Flexibility'
        },
        {
          name: 'Swimming',
          description: 'Low-impact full-body exercise perfect for maintenance.',
          sets: '1',
          reps: '30-45 minutes',
          category: 'Cardio'
        },
        {
          name: 'Cycling',
          description: 'Great cardiovascular exercise that\'s easy on the joints.',
          sets: '1',
          reps: '45-60 minutes',
          category: 'Cardio'
        }
      ]
    };

    res.json({ exercises: exercises[goal.toLowerCase()] || exercises.maintain, goal });
  } catch (error: any) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
