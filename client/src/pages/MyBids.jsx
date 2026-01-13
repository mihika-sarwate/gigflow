import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../store/slices/bidSlice';
import { DollarSign, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  const getBidStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/20', text: 'Pending' },
      hired: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20', text: 'Hired ✨' },
      rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-900/20', text: 'Not Selected' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {badge.text}
      </span>
    );
  };

  const getGigStatusBadge = (status) => {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs ${
          status === 'open'
            ? 'bg-green-900/20 text-green-400'
            : 'bg-blue-900/20 text-blue-400'
        }`}
      >
        {status === 'open' ? 'Open' : 'Assigned'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Bids</h1>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-400">Loading your bids...</p>
        </div>
      ) : myBids.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">You haven't submitted any bids yet.</p>
          <a href="/dashboard" className="btn-primary mt-4 inline-block">
            Browse Gigs
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className={`card ${
                bid.status === 'hired'
                  ? 'border-green-500 bg-green-900/5'
                  : bid.status === 'rejected'
                  ? 'border-red-900/50'
                  : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {bid.gigId?.title || 'Gig Deleted'}
                      </h3>
                      {bid.gigId && getGigStatusBadge(bid.gigId.status)}
                    </div>
                  </div>

                  {bid.gigId && (
                    <p className="text-gray-400 mb-3">{bid.gigId.description}</p>
                  )}

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-300">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span>
                        Your Bid: <span className="font-semibold">${bid.price}</span>
                        {bid.gigId && (
                          <span className="text-gray-500 ml-2">
                            (Budget: ${bid.gigId.budget})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Submitted: {new Date(bid.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-dark-bg rounded p-3 mb-3">
                    <p className="text-sm font-medium text-gray-300 mb-1">Your Cover Letter:</p>
                    <p className="text-gray-400 text-sm">{bid.message}</p>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-2">
                  {getBidStatusBadge(bid.status)}
                  {bid.status === 'hired' && (
                    <div className="text-center md:text-right mt-2">
                      <p className="text-sm text-green-400 font-semibold">🎉 Congratulations!</p>
                      <p className="text-xs text-gray-500">You've been hired for this project</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {myBids.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-gray-400 text-sm mb-1">Total Bids</p>
            <p className="text-3xl font-bold text-white">{myBids.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-400 text-sm mb-1">Hired</p>
            <p className="text-3xl font-bold text-green-400">
              {myBids.filter((b) => b.status === 'hired').length}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">
              {myBids.filter((b) => b.status === 'pending').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;
