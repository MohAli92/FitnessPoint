import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { dbGet, dbAll } from '../database';

const router = express.Router();

// Calculate calories based on user goal
router.post('/calculate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user: any = await dbGet('SELECT * FROM users WHERE id = ?', [req.userId]);
    
    const { age, weight, height, gender, activity_level, goal } = req.body;
    const userAge = age || user.age;
    const userWeight = weight || user.weight;
    const userHeight = height || user.height;
    const userGender = gender || user.gender;
    const userActivity = activity_level || user.activity_level || 'moderate';
    const userGoal = goal || user.goal || 'maintain';

    if (!userAge || !userWeight || !userHeight || !userGender) {
      return res.status(400).json({ error: 'Age, weight, height, and gender are required' });
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (userGender.toLowerCase() === 'male') {
      bmr = 10 * userWeight + 6.25 * userHeight - 5 * userAge + 5;
    } else {
      bmr = 10 * userWeight + 6.25 * userHeight - 5 * userAge - 161;
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * (activityMultipliers[userActivity.toLowerCase()] || 1.55);

    // Goal adjustments
    let targetCalories: number;
    const goalAdjustments: { [key: string]: number } = {
      lose: -500, // 1 lb per week
      maintain: 0,
      gain: 500 // 1 lb per week
    };

    targetCalories = tdee + (goalAdjustments[userGoal.toLowerCase()] || 0);

    // Calculate macronutrients (standard split)
    const proteinGrams = Math.round(userWeight * 2.2); // 1g per lb of body weight
    const proteinCalories = proteinGrams * 4;
    const remainingCalories = targetCalories - proteinCalories;
    const fatGrams = Math.round((targetCalories * 0.25) / 9); // 25% from fat
    const fatCalories = fatGrams * 9;
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);

    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      goal: userGoal,
      activityLevel: userActivity,
      macros: {
        protein: {
          grams: proteinGrams,
          calories: proteinCalories,
          percentage: Math.round((proteinCalories / targetCalories) * 100)
        },
        carbs: {
          grams: carbGrams,
          calories: carbCalories,
          percentage: Math.round((carbCalories / targetCalories) * 100)
        },
        fat: {
          grams: fatGrams,
          calories: fatCalories,
          percentage: Math.round((fatCalories / targetCalories) * 100)
        }
      }
    });
  } catch (error: any) {
    console.error('Calculate calories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Suggest foods based on calorie needs and dietary preferences
router.post('/suggest-foods', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { targetCalories, dietaryPreferences } = req.body;

    if (!targetCalories || !dietaryPreferences || !Array.isArray(dietaryPreferences)) {
      return res.status(400).json({ error: 'Target calories and dietary preferences are required' });
    }

    // Build query to filter foods based on dietary preferences
    let query = 'SELECT * FROM foods WHERE 1=1';
    const params: any[] = [];

    // Filter by dietary tags
    if (dietaryPreferences.length > 0) {
      const tagConditions = dietaryPreferences.map((tag: string) => {
        return `dietary_tags LIKE ?`;
      });
      query += ` AND (${tagConditions.join(' OR ')})`;
      dietaryPreferences.forEach((tag: string) => {
        params.push(`%${tag.toLowerCase()}%`);
      });
    }

    // Get all matching foods
    let foods: any[] = await dbAll(query, params);

    // If no foods match, get all foods
    if (foods.length === 0) {
      foods = await dbAll('SELECT * FROM foods', []);
    }

    // Calculate meal suggestions
    // Distribute calories across 3 meals: breakfast (25%), lunch (35%), dinner (30%), snacks (10%)
    const breakfastCalories = Math.round(targetCalories * 0.25);
    const lunchCalories = Math.round(targetCalories * 0.35);
    const dinnerCalories = Math.round(targetCalories * 0.30);
    const snackCalories = Math.round(targetCalories * 0.10);

    const suggestMeal = (targetCal: number, mealType: string) => {
      const suggestions: any[] = [];
      let remainingCalories = targetCal;
      const usedFoods = new Set<number>();

      // Try to create a balanced meal
      // First, add a protein source
      const proteins = foods.filter(f => 
        f.protein > 10 && !usedFoods.has(f.id) && 
        f.calories <= remainingCalories * 0.4
      );
      if (proteins.length > 0) {
        const protein = proteins[Math.floor(Math.random() * proteins.length)];
        const servings = Math.max(1, Math.floor((targetCal * 0.3) / protein.calories));
        suggestions.push({ ...protein, servings, meal_calories: protein.calories * servings });
        remainingCalories -= protein.calories * servings;
        usedFoods.add(protein.id);
      }

      // Add a carb source
      const carbs = foods.filter(f => 
        f.carbs > 10 && !usedFoods.has(f.id) && 
        f.calories <= remainingCalories * 0.4
      );
      if (carbs.length > 0 && remainingCalories > 100) {
        const carb = carbs[Math.floor(Math.random() * carbs.length)];
        const servings = Math.max(1, Math.floor((targetCal * 0.25) / carb.calories));
        suggestions.push({ ...carb, servings, meal_calories: carb.calories * servings });
        remainingCalories -= carb.calories * servings;
        usedFoods.add(carb.id);
      }

      // Add vegetables/fruits
      const veggies = foods.filter(f => 
        (f.calories < 100 || f.name.toLowerCase().includes('vegetable') || 
         f.name.toLowerCase().includes('broccoli') || f.name.toLowerCase().includes('spinach')) &&
        !usedFoods.has(f.id) && f.calories <= remainingCalories
      );
      if (veggies.length > 0 && remainingCalories > 50) {
        const veggie = veggies[Math.floor(Math.random() * veggies.length)];
        const servings = Math.max(1, Math.floor(remainingCalories / veggie.calories));
        suggestions.push({ ...veggie, servings, meal_calories: veggie.calories * servings });
        remainingCalories -= veggie.calories * servings;
        usedFoods.add(veggie.id);
      }

      // Add a fat source if needed
      if (remainingCalories > 50) {
        const fats = foods.filter(f => 
          f.fat > 5 && !usedFoods.has(f.id) && 
          f.calories <= remainingCalories
        );
        if (fats.length > 0) {
          const fat = fats[Math.floor(Math.random() * fats.length)];
          const servings = Math.max(0.5, Math.floor(remainingCalories / fat.calories));
          suggestions.push({ ...fat, servings, meal_calories: fat.calories * servings });
        }
      }

      const totalMealCalories = suggestions.reduce((sum, item) => sum + item.meal_calories, 0);
      return {
        mealType,
        foods: suggestions,
        totalCalories: Math.round(totalMealCalories),
        targetCalories: targetCal
      };
    };

    const suggestions = {
      breakfast: suggestMeal(breakfastCalories, 'Breakfast'),
      lunch: suggestMeal(lunchCalories, 'Lunch'),
      dinner: suggestMeal(dinnerCalories, 'Dinner'),
      snacks: suggestMeal(snackCalories, 'Snacks')
    };

    res.json({
      dailyTarget: targetCalories,
      suggestions,
      dietaryPreferences
    });
  } catch (error: any) {
    console.error('Suggest foods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
