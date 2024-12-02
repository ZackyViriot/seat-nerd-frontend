import React, { useState, useEffect } from "react";
import UserDashboardHeader from "./UserDashboardComponents/UserDashboardHeader";
import ShowtimeSelector from "./UserDashboardComponents/ShowtimeSelector";
import axios from 'axios';

// Mock user data - Replace with actual user data from your auth system
const userData = {
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" // Placeholder avatar
};

const UserDashboard = () => {
    const [recentBookings, setRecentBookings] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('showtimes');

 

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <UserDashboardHeader />
            
            <main className="pt-20 pb-12">
                


                {/* Main Content Section */}
                <section className="py-12">
                    <div className="container mx-auto px-6 lg:px-8">
                        {activeTab === 'showtimes' && (
                            <div>
                                <div className="max-w-4xl mx-auto text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4
                                                 transform transition-all duration-500 hover:scale-105">
                                        Available Showtimes
                                    </h2>
                                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-8 
                                                  transform transition-all duration-500 hover:w-32"></div>
                                </div>
                                <ShowtimeSelector />
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div>
                                <div className="max-w-4xl mx-auto text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        Your Recent Bookings
                                    </h2>
                                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
                                </div>
                                <div className="grid gap-6">
                                    {recentBookings.map((booking) => (
                                        <div key={booking.id} 
                                             className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 
                                                      transition-colors border border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white mb-2">
                                                        {booking.movieTitle}
                                                    </h3>
                                                    <p className="text-gray-400">
                                                        Date: {new Date(booking.showtime).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-400">
                                                        Time: {new Date(booking.showtime).toLocaleTimeString()}
                                                    </p>
                                                    <p className="text-gray-400">
                                                        Tickets: {booking.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 rounded-full 
                                                                   bg-blue-500/20 text-blue-400">
                                                        ${booking.totalPrice}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'upcoming' && (
                            <div>
                                <div className="max-w-4xl mx-auto text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        Coming Soon
                                    </h2>
                                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingMovies.map((movie) => (
                                        <div key={movie.id} 
                                             className="bg-gray-800 rounded-lg overflow-hidden hover:transform 
                                                      hover:scale-105 transition-all duration-300">
                                            <img 
                                                src={movie.posterUrl} 
                                                alt={movie.title}
                                                className="w-full h-64 object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {movie.title}
                                                </h3>
                                                <p className="text-gray-400 mb-4">
                                                    Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                                                </p>
                                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg
                                                                 hover:bg-blue-700 transition-colors">
                                                    Set Reminder
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Need Help?</h3>
                            <ul className="space-y-2">
                                <li className="text-gray-400">
                                    <span className="text-blue-500">Email:</span> support@seatnerd.com
                                </li>
                                <li className="text-gray-400">
                                    <span className="text-blue-500">Phone:</span> (555) 123-4567
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                    <i className="fab fa-facebook-f text-xl"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                    <i className="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                    <i className="fab fa-instagram text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400">
                            &copy; {new Date().getFullYear()} SeatNerd. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <link 
                rel="stylesheet" 
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
            />
        </div>
    );
};

export default UserDashboard;