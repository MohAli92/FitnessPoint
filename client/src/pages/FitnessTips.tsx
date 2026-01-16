import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FireIcon, LightBulbIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

interface Tip {
  title: string;
  content: string;
  category: string;
}

interface Exercise {
  name: string;
  description: string;
  sets: string;
  reps: string;
  category: string;
}

const FitnessTips: React.FC = () => {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState(user?.goal || 'maintain');
  const [tips, setTips] = useState<Tip[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tips' | 'exercises'>('tips');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tipsResponse, exercisesResponse] = await Promise.all([
        axios.get(`${API_URL}/fitness/tips`, { params: { goal: selectedGoal } }),
        axios.get(`${API_URL}/fitness/exercises`, { params: { goal: selectedGoal } })
      ]);
      setTips(tipsResponse.data.tips);
      setExercises(exercisesResponse.data.exercises);
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGoal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition':
        return '🍎';
      case 'exercise':
        return '💪';
      case 'strength':
        return '🏋️';
      case 'cardio':
        return '🏃';
      case 'lifestyle':
        return '✨';
      case 'flexibility':
        return '🧘';
      case 'mixed':
        return '⚡';
      default:
        return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition':
        return 'bg-green-100 text-green-800';
      case 'exercise':
      case 'strength':
      case 'cardio':
      case 'mixed':
        return 'bg-blue-100 text-blue-800';
      case 'lifestyle':
        return 'bg-purple-100 text-purple-800';
      case 'flexibility':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <FireIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Fitness Tips & Exercises</h1>
        </div>
        <p className="text-gray-600">
          Get personalized fitness advice and exercise recommendations based on your goals.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Goal
        </label>
        <select
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
        </select>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tips')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tips'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LightBulbIcon className="w-5 h-5 inline mr-2" />
            Tips
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'exercises'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AcademicCapIcon className="w-5 h-5 inline mr-2" />
            Exercises
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : activeTab === 'tips' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
                  {tip.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((exercise, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{exercise.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
                  {exercise.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{exercise.description}</p>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500">Sets:</span>
                  <span className="ml-2 font-semibold text-gray-900">{exercise.sets}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Reps:</span>
                  <span className="ml-2 font-semibold text-gray-900">{exercise.reps}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'tips' && tips.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No tips available for this goal.</p>
        </div>
      )}

      {!loading && activeTab === 'exercises' && exercises.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No exercises available for this goal.</p>
        </div>
      )}
    </div>
  );
};

export default FitnessTips;
