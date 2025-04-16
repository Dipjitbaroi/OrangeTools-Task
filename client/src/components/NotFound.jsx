import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <button
        onClick={handleGoHome}
        className="bg-[#182F59] text-white py-2 px-4 rounded-lg"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
