import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                GigFlow
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with talented freelancers or find your next project. A seamless marketplace for gigs and opportunities.
            </p>
            <div className="flex justify-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                    Browse Gigs
                  </Link>
                  <Link to="/my-gigs" className="btn-secondary text-lg px-8 py-3">
                    My Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Choose GigFlow?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Briefcase className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Post & Browse Gigs</h3>
            <p className="text-gray-400">
              Easily post jobs or browse available opportunities in one place.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Talent</h3>
            <p className="text-gray-400">
              Find skilled freelancers ready to bring your projects to life.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Bidding</h3>
            <p className="text-gray-400">
              Submit competitive bids and negotiate the best rates for projects.
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-400">
              Get instant notifications when you're hired for a project.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of clients and freelancers on GigFlow today.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
