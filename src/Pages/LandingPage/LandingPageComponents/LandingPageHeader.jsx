import React from 'react'
import { FaCouch } from 'react-icons/fa'

const LandingPageHeader = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="bg-gray-900 text-white fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => scrollToSection('hero')}
                            className="hover:text-red-500 transition-colors font-bold leading-tight flex items-center gap-2"
                        >
                            <div className="flex flex-col items-center">
                                <span className="block text-2xl -mt-1">SEAT</span>

                                <span className="block text-sm tracking-widest">NERD</span>
                            </div>
                            <FaCouch className="w-8 h-8" />
                        </button>
                    </div>

                    <nav className="flex items-center space-x-6">
                        <button
                            onClick={() => scrollToSection('trending')}
                            className="hover:text-red-500 transition-colors"
                        >
                            Trending Movies
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="hover:text-red-500 transition-colors"
                        >
                            Contact Us
                        </button>
                        <button
                            onClick={() => scrollToSection('login')}
                            className="hover:text-red-500 transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => scrollToSection('signup')}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                        >
                            Sign Up
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default LandingPageHeader