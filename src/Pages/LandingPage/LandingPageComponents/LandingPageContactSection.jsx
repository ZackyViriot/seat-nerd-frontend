import React, { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const LandingPageContactSection = () => {
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xanynozz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Get in Touch</h2>
          
          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:transform hover:scale-105 transition-all duration-300">
              <Phone className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">(123) 456-7890</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:transform hover:scale-105 transition-all duration-300">
              <Mail className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400">contact@seatnerd.com</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:transform hover:scale-105 transition-all duration-300">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-400">123 Theater Street, Movie City</p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        placeholder="Your message"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors duration-300"
                      disabled={formStatus === 'sending'}
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                    {formStatus === 'success' && (
                      <p className="text-green-500 text-center">Message sent successfully!</p>
                    )}
                    {formStatus === 'error' && (
                      <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
                    )}
                  </form>
                </div>

                {/* Map or Additional Info Section */}
                <div className="bg-gray-700 rounded-xl p-6 flex flex-col justify-center space-y-6">
                  <h3 className="text-2xl font-semibold text-white mb-4">Why Contact Us?</h3>
                  <div className="space-y-4 text-gray-300">
                    <p>• Get help with your booking</p>
                    <p>• Learn about group reservations</p>
                    <p>• Special event inquiries</p>
                    <p>• Technical support</p>
                    <p>• Partnership opportunities</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-400">Our support team is available 24/7 to assist you with any questions or concerns.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPageContactSection;