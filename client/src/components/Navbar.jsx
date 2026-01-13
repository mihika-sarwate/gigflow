import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, X, Briefcase, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-dark-card border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                GigFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Browse Gigs
                </Link>
                <Link to="/my-gigs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  My Gigs
                </Link>
                <Link to="/my-bids" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  My Bids
                </Link>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-300 hover:text-white"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-dark-card border border-dark-border rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                        {notifications.length === 0 ? (
                          <p className="text-gray-400 text-sm">No notifications</p>
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-3 rounded ${
                                  notif.read ? 'bg-dark-bg' : 'bg-primary-900/20'
                                }`}
                              >
                                <p className="text-sm">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notif.id).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-dark-border">
                  <Link to={`/profile/${user?._id}`} className="text-gray-300 hover:text-white text-sm">
                    {user?.name}
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary text-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-hover"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Gigs
                </Link>
                <Link
                  to="/my-gigs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-hover"
                  onClick={() => setIsOpen(false)}
                >
                  My Gigs
                </Link>
                <Link
                  to="/my-bids"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-hover"
                  onClick={() => setIsOpen(false)}
                >
                  My Bids
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-hover"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-hover"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-hover"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
