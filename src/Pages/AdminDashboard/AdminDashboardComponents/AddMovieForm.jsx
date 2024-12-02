import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../axios/axiosSetup';

const AddMovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    rating: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/movies', formData);
      setSuccess('Movie added successfully!');
      setError('');
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        rating: 0,
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add movie. Please try again.');
      setSuccess('');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Add New Movie</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            placeholder="Enter movie title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            placeholder="Enter movie description"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            placeholder="Enter image URL"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Rating (0-10)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition duration-200"
        >
          Add Movie
        </button>
      </form>
    </>
  );
};

export default AddMovieForm;