import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigSlice';
import { submitBid } from '../store/slices/bidSlice';
import toast from 'react-hot-toast';
import { Search, DollarSign, User, Calendar, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGig, setSelectedGig] = useState(null);
  const [bidData, setBidData] = useState({ message: '', price: '' });
  
  const dispatch = useDispatch();
  const { gigs, isLoading } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(searchQuery));
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!bidData.message || !bidData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(
      submitBid({
        gigId: selectedGig._id,
        message: bidData.message,
        price: Number(bidData.price),
      })
    );

    if (submitBid.fulfilled.match(result)) {
      toast.success('Bid submitted successfully!');
      setSelectedGig(null);
      setBidData({ message: '', price: '' });
    } else {
      toast.error(result.payload || 'Failed to submit bid');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Browse Available Gigs</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gigs by title or description..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Gigs Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-400">Loading gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No gigs available at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig._id} className="card hover:border-primary-500 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">{gig.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{gig.description}</p>
              
              <div className="space-y-2 mb-4">
                {gig.category && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-primary-900/20 text-primary-400 rounded text-xs">
                      {gig.category}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-300">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-semibold">${gig.budget}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  <span>{gig.ownerId?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {gig.ownerId?._id !== user?._id && (
                <button
                  onClick={() => setSelectedGig(gig)}
                  className="w-full btn-primary"
                >
                  Submit Bid
                </button>
              )}
              
              {gig.ownerId?._id === user?._id && (
                <div className="w-full px-4 py-2 bg-dark-bg border border-primary-500 rounded-lg text-center text-sm text-primary-400">
                  Your Gig
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {selectedGig && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Your Bid</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-300">{selectedGig.title}</h3>
              <p className="text-sm text-gray-400">Budget: ${selectedGig.budget}</p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidData.price}
                  onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                  className="input-field"
                  placeholder="Enter your bid amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={bidData.message}
                  onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Explain why you're the best fit for this project..."
                  required
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-primary">
                  Submit Bid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGig(null);
                    setBidData({ message: '', price: '' });
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
    </div>
  );
};

export default Dashboard;
