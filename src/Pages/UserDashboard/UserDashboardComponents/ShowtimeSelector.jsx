import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosInstance from "../../../axios/axiosSetup";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51QRPF6GDlcFzOwRVEJvLkMMRszuqwYRWbkkWohm4sMriIscHDCSIy3bbjzjs8Ru0Lcn5zr73r7jRET97blOySnfj000SweidEo');

// Confirmation Modal Component
const PurchaseConfirmationModal = ({ isOpen, onClose, movieTitle, quantity, email }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Purchase Successful!</h3>
                    
                    <div className="mb-6 text-gray-600">
                        <p className="mb-2">Your tickets for <span className="font-semibold">{movieTitle}</span> have been confirmed.</p>
                        <p className="mb-2">Quantity: {quantity} ticket{quantity > 1 ? 's' : ''}</p>
                        <p className="text-sm">A confirmation email has been sent to:</p>
                        <p className="font-medium">{email}</p>
                    </div>

                    <div className="mt-4 space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutForm = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !email) {
            setError('Please provide your email');
            return;
        }

        setProcessing(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setProcessing(false);
            return;
        }

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
                receipt_email: email,
            },
            redirect: 'if_required',
        });

        if (confirmError) {
            setError(confirmError.message);
        } else {
            onSuccess(email);
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email for Receipt</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded-lg"
                    placeholder="your@email.com"
                />
            </div>
            <PaymentElement />
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing || !email}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                    transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
            >
                {processing ? "Processing..." : `Pay $${(amount).toFixed(2)}`}
            </button>
        </form>
    );
};

const ShowtimeSelector = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState({});
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [purchaseDetails, setPurchaseDetails] = useState(null);

    const fetchShowtimesAndMovies = async () => {
        try {
            const showtimesResponse = await axiosInstance.get("/showtimes");
            const showtimesData = showtimesResponse.data;
            setShowtimes(showtimesData);

            // Get unique movie IDs
            const movieIds = [...new Set(showtimesData.map(showtime => showtime.movieId))];

            // Fetch movie details for each unique movieId
            const moviesData = {};
            await Promise.all(
                movieIds.map(async (movieId) => {
                    const movieResponse = await axiosInstance.get(`/movies/${movieId}`);
                    moviesData[movieId] = movieResponse.data;
                })
            );
            setMovies(moviesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShowtimesAndMovies();
    }, []);

    const handlePurchaseIntent = async () => {
        if (!selectedShowtime) return;

        try {
            const response = await axiosInstance.post(`/showtimes/${selectedShowtime._id}/purchase`, {
                numberOfTickets: quantity
            });
            
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            console.error("Error initiating purchase:", error);
            alert("Failed to initiate purchase");
        }
    };

    const handlePaymentSuccess = async (email) => {
        try {
            await axiosInstance.post(`/showtimes/${selectedShowtime._id}/confirm`, {
                numberOfTickets: quantity,
                email: email
            });
            
            await fetchShowtimesAndMovies();
            
            // Set purchase details and show confirmation modal
            setPurchaseDetails({
                email,
                quantity,
                movieTitle: movies[selectedShowtime.movieId]?.title
            });
            setShowConfirmation(true);
            
            // Clear form
            setSelectedShowtime(null);
            setQuantity(1);
            setClientSecret(null);
        } catch (error) {
            console.error("Error confirming purchase:", error);
            alert("Error updating tickets. Please contact support with your confirmation email.");
        }
    };

    if (loading) {
        return <div className="text-center">Loading showtimes...</div>;
    }

    return (
        <>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Select Showtime</h2>
                
                <div className="grid gap-4 mb-6">
                    {showtimes.map((showtime) => (
                        <div
                            key={showtime._id}
                            className={`p-4 border rounded-lg ${
                                showtime.availableTickets === 0 
                                    ? 'bg-gray-100 opacity-50' 
                                    : 'hover:border-blue-500 cursor-pointer'
                            } ${selectedShowtime?._id === showtime._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            onClick={() => showtime.availableTickets > 0 && setSelectedShowtime(showtime)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-lg">
                                        {movies[showtime.movieId]?.title || 'Loading...'}
                                    </div>
                                    <div className="text-gray-600 mt-1">
                                        {new Date(showtime.startTime).toLocaleString()}
                                    </div>
                                    <div className="text-gray-600 mt-1">
                                        Price: ${showtime.ticketPrice}
                                    </div>
                                </div>
                                <div className={`text-right ${showtime.availableTickets < 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                    {showtime.availableTickets} / {showtime.totalTickets} tickets available
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedShowtime && !clientSecret && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Number of Tickets:</label>
                            <input
                                type="number"
                                min="1"
                                max={selectedShowtime.availableTickets}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(
                                    selectedShowtime.availableTickets,
                                    Math.max(1, parseInt(e.target.value) || 1)
                                ))}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Purchase Summary</h3>
                            <div className="text-gray-600">
                                <p>Movie: {movies[selectedShowtime.movieId]?.title}</p>
                                <p>Time: {new Date(selectedShowtime.startTime).toLocaleString()}</p>
                                <p>Tickets: {quantity}</p>
                                <p className="font-semibold mt-2">
                                    Total: ${(quantity * selectedShowtime.ticketPrice).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handlePurchaseIntent}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
                                transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={quantity > selectedShowtime.availableTickets}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                )}

                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm 
                            amount={quantity * selectedShowtime.ticketPrice}
                            onSuccess={handlePaymentSuccess}
                        />
                    </Elements>
                )}
            </div>

            <PurchaseConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                {...purchaseDetails}
            />
        </>
    );
};

export default ShowtimeSelector;