import React, { useState, useEffect } from 'react'
import axios from 'axios';
import AdminDashboardHeader from './AdminDashboardComponents/AdminDashboardHeader';
import AddMovieForm from './AdminDashboardComponents/AddMovieForm';
import AddShowtimeForm from './AdminDashboardComponents/AddShowtimeForm';
import MovieTable from './AdminDashboardComponents/MovieTable';
import ShowtimeTable from './AdminDashboardComponents/ShowtimeTable';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalShowtimes: 0,
        averageRating: 0
    });
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            // Fetch movies stats
            const moviesResponse = await axios.get('http://localhost:8000/movies');
            const movies = moviesResponse.data;
            
            // Fetch showtimes stats
            const showtimesResponse = await axios.get('http://localhost:8000/showtimes');
            const showtimes = showtimesResponse.data;

            const totalMovies = movies.length;
            const totalShowtimes = showtimes.length;
            const averageRating = movies.length > 0 
                ? (movies.reduce((sum, movie) => sum + parseFloat(movie.rating), 0) / movies.length).toFixed(1)
                : 0;

            setStats({
                totalMovies,
                totalShowtimes,
                averageRating
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };
   
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        const verifyAdmin = async () => {
            try {
                await axios.get('http://localhost:8000/users/admin-only', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // If the request succeeds, user is an admin, so fetch stats
                fetchStats();
            } catch (error) {
                console.error('Not authorized as admin:', error);
                navigate('/');
            }
        };

        verifyAdmin();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-900">
            <AdminDashboardHeader/>
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Movie Management Dashboard</h1>
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Total Movies</h3>
                        <p className="text-white text-2xl font-bold mt-2">{stats.totalMovies}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Total Showtimes</h3>
                        <p className="text-white text-2xl font-bold mt-2">{stats.totalShowtimes}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Average Rating</h3>
                        <p className="text-white text-2xl font-bold mt-2">{stats.averageRating}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forms Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                            <AddMovieForm onMovieAdded={fetchStats}/>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <AddShowtimeForm onShowtimeAdded={fetchStats}/>
                        </div>
                    </div>

                    {/* Tables Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800 rounded-lg shadow-lg">
                            <MovieTable onMovieDeleted={fetchStats}/>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-lg">
                            <ShowtimeTable onShowtimeDeleted={fetchStats}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}