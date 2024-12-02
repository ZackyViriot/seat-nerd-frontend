import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosInstance from '../../../axios/axiosSetup';

const LandingPageMovieGallery = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axiosInstance.get('/movies');
                setMovies(response.data);
            } catch (err) {
                setError('Failed to fetch movies');
                console.error('Error fetching movies:', err);
            }
        };

        fetchMovies();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: !isPaused,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnHover: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
        if (sliderRef.current) {
            sliderRef.current.slickPause();
        }
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
        if (sliderRef.current) {
            sliderRef.current.slickPlay();
        }
    };

    return (
        <section id="trending" className="pt-0">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    Trending Movies
                </h2>

                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}
                    </div>
                )}

                {movies.length > 0 && (
                    <div className="relative px-4">
                        <Slider ref={sliderRef} {...settings}>
                            {[...movies, ...movies].map((movie, index) => (
                                <div 
                                    key={`${movie._id}-${index}`} 
                                    className="px-2"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300">
                                        <div className="relative pb-[150%]">
                                            <img
                                                src={movie.imageUrl}
                                                alt={movie.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-xl font-semibold text-white mb-2 truncate">
                                                {movie.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                                {movie.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                                    Rating: {movie.rating}/10
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                {movies.length === 0 && !error && (
                    <div className="text-gray-400 text-center">
                        Loading movies...
                    </div>
                )}
            </div>
        </section>
    );
};

export default LandingPageMovieGallery;