import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import axiosInstance from '../../../axios/axiosSetup';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, showtime, movies }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the showtime for "{movies[showtime.movieId]?.title}" at {new Date(showtime.startTime).toLocaleString()}? This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ShowtimeTable = ({ onShowtimeDeleted }) => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState({});
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    showtime: null
  });

  useEffect(() => {
    fetchShowtimes();
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get('/movies');
      const movieMap = {};
      response.data.forEach(movie => {
        movieMap[movie._id] = movie;
      });
      setMovies(movieMap);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies');
    }
  };

  const fetchShowtimes = async () => {
    try {
      console.log('Fetching showtimes...');
      const response = await axiosInstance.get('/showtimes');
      console.log('Fetched showtimes:', response.data);
      setShowtimes(response.data);
    } catch (err) {
      console.error('Error fetching showtimes:', err.response?.data);
      setError('Failed to fetch showtimes');
    }
  };

  const handleDeleteClick = (showtime) => {
    console.log('Delete clicked for showtime:', showtime);
    setDeleteModal({
      isOpen: true,
      showtime
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting showtime:', deleteModal.showtime);
      await axiosInstance.delete(`/showtimes/${deleteModal.showtime._id}`);
      await fetchShowtimes(); // Refresh the list after deletion
      setDeleteModal({ isOpen: false, showtime: null });
      if (onShowtimeDeleted) {
        onShowtimeDeleted();
      }
    } catch (err) {
      console.error('Error deleting showtime:', err.response?.data);
      setError('Failed to delete showtime');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '$0.00';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Showtimes List</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Movie</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Start Time</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Available Tickets</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {showtimes.map((showtime) => (
              <tr 
                key={showtime._id} 
                className="hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-sm text-gray-300">
                  {movies[showtime.movieId]?.title || 'Loading...'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatDateTime(showtime.startTime)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatPrice(showtime.ticketPrice)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {showtime.availableTickets} / {showtime.totalTickets}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleDeleteClick(showtime)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Delete showtime"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {showtimes.length === 0 && (
              <tr>
                <td 
                  colSpan="5" 
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No showtimes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, showtime: null })}
        onConfirm={handleDeleteConfirm}
        showtime={deleteModal.showtime}
        movies={movies}
      />
    </div>
  );
};

export default ShowtimeTable;