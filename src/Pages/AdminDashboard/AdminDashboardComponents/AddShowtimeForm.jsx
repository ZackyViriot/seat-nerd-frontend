import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddShowtimeForm = ({ onShowtimeAdded }) => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    movieId: '',
    startTime: '',
    totalTickets: 0,
    ticketPrice: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch movies for the dropdown
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/movies');
        setMovies(response.data);
        // Set the first movie as default if available
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            movieId: response.data[0]._id
          }));
        }
      } catch (err) {
        setError('Failed to fetch movies');
      }
    };
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['totalTickets', 'ticketPrice'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.movieId) {
      setError('Please select a movie');
      return;
    }
  
    if (!formData.startTime) {
      setError('Please select a start time');
      return;
    }
  
    if (formData.totalTickets <= 0) {
      setError('Total tickets must be greater than 0');
      return;
    }
  
    if (formData.ticketPrice < 0) {
      setError('Price cannot be negative');
      return;
    }
  
    try {
      // Prepare the data
      const showtimeData = {
        movieId: formData.movieId,
        startTime: new Date(formData.startTime).toISOString(),
        totalTickets: Number(formData.totalTickets),
        ticketPrice: Number(formData.ticketPrice)
      };
  
      // Make the API call
      const response = await axios.post('http://localhost:8000/showtimes', showtimeData);
  
      // Handle success
      setSuccess('Showtime added successfully!');
      setError('');
      
      // Reset form to initial state
      setFormData({
        movieId: movies.length > 0 ? movies[0]._id : '',
        startTime: '',
        totalTickets: 0,
        ticketPrice: 0,
      });
  
      // Call the callback function if provided
      if (onShowtimeAdded) {
        onShowtimeAdded();
      }
  
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
  
    } catch (err) {
      // Handle errors
      console.error('Error adding showtime:', err);
      setError(
        err.response?.data?.message || 
        'Failed to add showtime. Please try again.'
      );
      setSuccess('');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Add New Showtime</h2>
      
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
          <label className="block text-gray-300 mb-2 font-medium">Movie</label>
          <select
            name="movieId"
            value={formData.movieId}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            required
          >
            {movies.map(movie => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Total Tickets</label>
          <input
            type="number"
            name="totalTickets"
            value={formData.totalTickets}
            onChange={handleChange}
            min="1"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Price ($)</label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition duration-200"
        >
          Add Showtime
        </button>
      </form>
    </>
  );
};

export default AddShowtimeForm;