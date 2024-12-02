import React from 'react';
import LandingPageHeader from './LandingPageComponents/LandingPageHeader';
import LandingPageLoginAndSignup from './LandingPageComponents/LandingPageLoginAndSignup';
import LandingPageContactSection from './LandingPageComponents/LandingPageContactSection';
import LandingPageMovieGallery from './LandingPageComponents/LandingPageMovieGallery';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            <LandingPageHeader />
            {/* Add padding-top to account for fixed header */}
            <main className="flex-1 pt-16"> {/* Adjust pt-16 based on your header height */}
                {/* Login/Signup Section - Minimal padding */}
                <section className="py-4 bg-gray-900">
                    <LandingPageLoginAndSignup />
                </section>

                {/* Movie Gallery Section */}
                <section className="py-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                    <LandingPageMovieGallery />
                </section>

                {/* Contact Section - Minimal padding */}
                <section className="py-4 bg-gray-900">
                    <LandingPageContactSection />
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 py-2">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>&copy; 2024 SeatNerd. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}