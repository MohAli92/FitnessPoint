import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

interface PostData {
  id: number;
  content: string;
  image_url?: string;
  username: string;
  user_id: number;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: number;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Check if this is first login
  const isFirstLogin = user?.last_login === null || user?.last_login === undefined;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: PostData) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost: PostData) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isFirstLogin 
            ? `Welcome to FitnessPoint, ${user?.username}!` 
            : `Welcome back, ${user?.username}!`}
        </h1>
        <p className="text-gray-600">
          {isFirstLogin 
            ? "Welcome! We're excited to have you here. Share your fitness journey and encourage others on their path to a healthier lifestyle."
            : "Share your fitness journey and encourage others on their path to a healthier lifestyle."}
        </p>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      <div className="mt-8 space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No posts yet. Be the first to share your fitness journey!</p>
          </div>
        ) : (
          posts.map(post => (
            <Post
              key={post.id}
              post={post}
              onUpdate={handlePostUpdated}
              onDelete={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
