import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, movieTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete "{movieTitle}"? This action cannot be undone.
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

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    movieId: null,
    movieTitle: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/movies');
      setMovies(response.data);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', err);
    }
  };

  const handleDeleteClick = (movie) => {
    setDeleteModal({
      isOpen: true,
      movieId: movie._id,
      movieTitle: movie.title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/movies/${deleteModal.movieId}`);
      fetchMovies(); // Refresh the list after deletion
      setDeleteModal({ isOpen: false, movieId: null, movieTitle: '' });
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Movies List</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Description</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-200">Rating</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {movies.map((movie) => (
              <tr 
                key={movie._id} 
                className="hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-sm text-gray-300">{movie.title}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {movie.description.length > 100 
                    ? `${movie.description.substring(0, 100)}...` 
                    : movie.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{movie.rating}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleDeleteClick(movie)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Delete movie"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td 
                  colSpan="4" 
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No movies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, movieId: null, movieTitle: '' })}
        onConfirm={handleDeleteConfirm}
        movieTitle={deleteModal.movieTitle}
      />
    </div>
  );
};

export default MovieTable;