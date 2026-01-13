import React from 'react';
import { useParams } from 'react-router-dom';

const GigDetails = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">Gig Details</h1>
      <p className="text-gray-400">Gig ID: {id}</p>
      <p className="text-gray-400 mt-4">This page can be expanded to show detailed gig information.</p>
    </div>
  );
};

export default GigDetails;
