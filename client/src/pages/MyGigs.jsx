import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs, createGig, deleteGig } from '../store/slices/gigSlice';
import { fetchGigBids, hireBid, clearBids } from '../store/slices/bidSlice';
import toast from 'react-hot-toast';
import { Plus, DollarSign, Calendar, Trash2, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyGigs = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'Other',
    skills: ''
  });

  const dispatch = useDispatch();
  const { myGigs, isLoading } = useSelector((state) => state.gigs);
  const { bids } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyGigs());
  }, [dispatch]);

  const handleCreateGig = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(
      createGig({
        ...formData,
        budget: Number(formData.budget),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      })
    );

    if (createGig.fulfilled.match(result)) {
      toast.success('Gig created successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', description: '', budget: '' });
    } else {
      toast.error(result.payload || 'Failed to create gig');
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;

    const result = await dispatch(deleteGig(gigId));
    if (deleteGig.fulfilled.match(result)) {
      toast.success('Gig deleted successfully');
    }
  };

  const handleViewBids = async (gig) => {
    setSelectedGig(gig);
    await dispatch(fetchGigBids(gig._id));
  };

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer?')) return;

    const result = await dispatch(hireBid(bidId));
    if (hireBid.fulfilled.match(result)) {
      toast.success('Freelancer hired successfully!');
      // Refresh gigs to update status
      dispatch(fetchMyGigs());
      setSelectedGig(null);
      dispatch(clearBids());
    } else {
      toast.error(result.payload || 'Failed to hire freelancer');
    }
  };

  const getBidStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/20', text: 'Pending' },
      hired: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20', text: 'Hired' },
      rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-900/20', text: 'Rejected' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Gigs</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Post New Gig
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : myGigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">You haven't posted any gigs yet.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-4">
            Post Your First Gig
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {myGigs.map((gig) => (
            <div key={gig._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{gig.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    gig.status === 'open'
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-blue-900/20 text-blue-400'
                  }`}
                >
                  {gig.status === 'open' ? 'Open' : 'Assigned'}
                </span>
              </div>
              
              <p className="text-gray-400 mb-4">{gig.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-semibold">${gig.budget}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewBids(gig)}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Bids
                </button>
                {gig.status === 'open' && (
                  <button
                    onClick={() => handleDeleteGig(gig._id)}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Gig Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Post a New Gig</h2>

            <form onSubmit={handleCreateGig} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Build a React Website"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Describe your project requirements..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="input-field"
                  placeholder="Enter budget amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Required Skills (optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="input-field"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-primary">
                  Post Gig
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ title: '', description: '', budget: '', category: 'Other', skills: '' });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Bids Modal */}
      {selectedGig && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-bold text-white mb-2">Bids for: {selectedGig.title}</h2>
            <p className="text-gray-400 mb-6">Budget: ${selectedGig.budget}</p>

            {bids.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No bids received yet.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bids.map((bid) => (
                  <div key={bid._id} className="bg-dark-bg border border-dark-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{bid.freelancerId?.name}</h4>
                        <p className="text-sm text-gray-400">{bid.freelancerId?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">${bid.price}</p>
                        {getBidStatusBadge(bid.status)}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{bid.message}</p>
                    
                    <div className="text-sm text-gray-500">
                      Submitted: {new Date(bid.createdAt).toLocaleString()}
                    </div>

                    {bid.status === 'pending' && selectedGig.status === 'open' && (
                      <button
                        onClick={() => handleHire(bid._id)}
                        className="mt-3 btn-primary w-full"
                      >
                        Hire This Freelancer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setSelectedGig(null);
                dispatch(clearBids());
              }}
              className="mt-6 btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGigs;
