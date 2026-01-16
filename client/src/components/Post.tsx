import React, { useState } from 'react';
import axios from 'axios';
import { HeartIcon, ChatBubbleLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

interface PostProps {
  post: {
    id: number;
    content: string;
    image_url?: string;
    username: string;
    user_id: number;
    created_at: string;
    like_count: number;
    comment_count: number;
    is_liked: number;
  };
  onUpdate: (post: any) => void;
  onDelete?: (postId: number) => void;
}

const Post: React.FC<PostProps> = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(post.is_liked > 0);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.image_url || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = user?.id === post.user_id;

  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts/${post.id}/like`);
      setLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${post.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/posts/${post.id}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
      onUpdate({ ...post, comment_count: post.comment_count + 1 });
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
    setEditImageUrl(post.image_url || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditImageUrl(post.image_url || '');
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/posts/${post.id}`, {
        content: editContent,
        image_url: editImageUrl || null
      });
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/posts/${post.id}`);
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{post.username}</p>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        {isOwner && !isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit post"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Delete post"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-3"
            rows={4}
          />
          <input
            type="text"
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={loading || !editContent.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
          {post.image_url && (
            <div className="mb-4">
              <img
                src={post.image_url}
                alt="Post content"
                className="w-full rounded-lg object-cover max-h-96"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </>
      )}

      {!isEditing && (
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            {liked ? (
              <HeartIconSolid className="w-6 h-6 text-primary-600" />
            ) : (
              <HeartIcon className="w-6 h-6" />
            )}
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          <button
            onClick={handleToggleComments}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ChatBubbleLeftIcon className="w-6 h-6" />
            <span className="text-sm font-medium">{post.comment_count}</span>
          </button>
        </div>
      )}

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? '...' : 'Post'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-semibold">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{comment.username}</p>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
