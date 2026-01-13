import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Star, MapPin, DollarSign, Award, Edit2, Briefcase, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    location: '',
    hourlyRate: ''
  });
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
    if (isOwnProfile) fetchStats();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/profile/${id}`);
      setProfile(res.data.user);
      setReviews(res.data.reviews);
      setFormData({
        bio: res.data.user.bio || '',
        skills: res.data.user.skills?.join(', ') || '',
        location: res.data.user.location || '',
        hourlyRate: res.data.user.hourlyRate || ''
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/stats`, {
        withCredentials: true
      });
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        },
        { withCredentials: true }
      );
      setProfile(res.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-dark-card rounded-lg mb-4"></div>
          <div className="h-64 bg-dark-card rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Card */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
                </div>
              )}
              {profile.rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                  {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
                </div>
              )}
              {profile.hourlyRate > 0 && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                  ${profile.hourlyRate}/hr
                </div>
              )}
            </div>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleUpdate} className="border-t border-dark-border pt-4 mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="input-field"
                  placeholder="React, Node.js, Python"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="New York, USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="input-field"
                  placeholder="50"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        )}

        {/* Bio */}
        {!isEditing && profile.bio && (
          <div className="border-t border-dark-border pt-4 mt-4">
            <p className="text-gray-300">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {!isEditing && profile.skills?.length > 0 && (
          <div className="border-t border-dark-border pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-900/20 text-primary-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats (Own Profile Only) */}
      {isOwnProfile && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary-500" />
            <p className="text-2xl font-bold text-white">{stats.gigsPosted}</p>
            <p className="text-sm text-gray-400">Gigs Posted</p>
          </div>
          <div className="card text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-white">{stats.bidsWon}</p>
            <p className="text-sm text-gray-400">Bids Won</p>
          </div>
          <div className="card text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-white">${stats.totalEarnings}</p>
            <p className="text-sm text-gray-400">Total Earned</p>
          </div>
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
            <p className="text-sm text-gray-400">Success Rate</p>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-dark-bg rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white">{review.reviewerId?.name}</p>
                    <p className="text-sm text-gray-400">{review.gigId?.title}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-semibold text-white">{review.rating}.0</span>
                  </div>
                </div>
                {review.comment && <p className="text-gray-300">{review.comment}</p>}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
