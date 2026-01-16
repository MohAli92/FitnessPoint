import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CalculatorIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  goal: string;
  activityLevel: string;
  macros: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  };
}

interface FoodSuggestion {
  mealType: string;
  foods: Array<{
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving_size: string;
    servings: number;
    meal_calories: number;
  }>;
  totalCalories: number;
  targetCalories: number;
}

interface FoodSuggestions {
  dailyTarget: number;
  suggestions: {
    breakfast: FoodSuggestion;
    lunch: FoodSuggestion;
    dinner: FoodSuggestion;
    snacks: FoodSuggestion;
  };
  dietaryPreferences: string[];
}

const CalorieCalculator: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    age: user?.age?.toString() || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    gender: user?.gender || '',
    activity_level: user?.activity_level || 'moderate',
    goal: user?.goal || 'maintain'
  });
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [foodSuggestions, setFoodSuggestions] = useState<FoodSuggestions | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const dietaryOptions = [
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'lactose_free', label: 'Lactose-Free' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'low_carb', label: 'Low-Carb' },
    { value: 'high_protein', label: 'High-Protein' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (value: string) => {
    setDietaryPreferences(prev => 
      prev.includes(value) 
        ? prev.filter(p => p !== value)
        : [...prev, value]
    );
  };

  const fetchFoodSuggestions = async () => {
    if (!result || dietaryPreferences.length === 0) {
      alert('Please select at least one dietary preference');
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await axios.post(`${API_URL}/calories/suggest-foods`, {
        targetCalories: result.targetCalories,
        dietaryPreferences
      });
      setFoodSuggestions(response.data);
    } catch (err: any) {
      console.error('Error fetching food suggestions:', err);
      alert('Failed to fetch food suggestions. Please try again.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/calories/calculate`, {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height)
      });
      setResult(response.data);
      
      // Update user profile
      await updateUser({
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender,
        activity_level: formData.activity_level,
        goal: formData.goal
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate calories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <CalculatorIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Calorie Calculator</h1>
        </div>
        <p className="text-gray-600">
          Calculate your daily calorie needs and macronutrient targets based on your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (years) *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level *
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise daily)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal *
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Calories'}
            </button>
          </form>

          {result && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Dietary Preferences</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select your dietary preferences to get personalized food suggestions
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {dietaryOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.includes(option.value)}
                      onChange={() => handlePreferenceChange(option.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={fetchFoodSuggestions}
                disabled={loadingSuggestions || dietaryPreferences.length === 0}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {loadingSuggestions ? 'Getting Suggestions...' : 'Get Food Suggestions'}
              </button>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Results</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Calorie Target</h3>
                <p className="text-4xl font-bold text-primary-600">{result.targetCalories}</p>
                <p className="text-sm text-gray-600 mt-2">calories per day</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Macros</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Protein</span>
                      <span className="text-sm font-semibold">{result.macros.protein.grams}g ({result.macros.protein.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full"
                        style={{ width: `${result.macros.protein.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Carbs</span>
                      <span className="text-sm font-semibold">{result.macros.carbs.grams}g ({result.macros.carbs.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${result.macros.carbs.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Fat</span>
                      <span className="text-sm font-semibold">{result.macros.fat.grams}g ({result.macros.fat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full"
                        style={{ width: `${result.macros.fat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">BMR (Basal Metabolic Rate)</p>
                    <p className="text-lg font-semibold text-gray-900">{result.bmr} cal</p>
                  </div>
                  <div>
                    <p className="text-gray-600">TDEE (Total Daily Energy Expenditure)</p>
                    <p className="text-lg font-semibold text-gray-900">{result.tdee} cal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {foodSuggestions && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <SparklesIcon className="w-6 h-6 text-primary-600 mr-2" />
              Personalized Food Suggestions
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Based on your daily target of <strong>{foodSuggestions.dailyTarget} calories</strong> and preferences: 
              <strong className="ml-1">{foodSuggestions.dietaryPreferences.join(', ')}</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(foodSuggestions.suggestions).map((meal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{meal.mealType}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Target: {meal.targetCalories} cal | Total: {meal.totalCalories} cal
                  </p>
                  <div className="space-y-2">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{food.name}</span>
                          <span className="text-sm font-semibold text-primary-600">
                            {Math.round(food.meal_calories)} cal
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            {food.servings > 1 ? `${food.servings}x ` : ''}{food.serving_size}
                          </div>
                          <div className="flex space-x-3 mt-1">
                            <span>P: {Math.round(food.protein * food.servings)}g</span>
                            <span>C: {Math.round(food.carbs * food.servings)}g</span>
                            <span>F: {Math.round(food.fat * food.servings)}g</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;
