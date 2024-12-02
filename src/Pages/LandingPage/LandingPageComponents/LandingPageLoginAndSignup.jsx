import { useState } from 'react';
import axiosInstance from '../../../axios/axiosSetup';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LandingPageLoginAndSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      const { confirmPassword, ...submitData } = formData;
      submitData.email = submitData.email.toLowerCase();
      
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const response = await axiosInstance.post(endpoint, submitData);
  
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        // For signup, use the role from form data
        // For login, use the role from response data
        const userRole = isLogin ? response.data.role : submitData.role;
        
        // Store user data including role
        localStorage.setItem('user', JSON.stringify({
          email: submitData.email,
          role: userRole
        }));
        
        if (userRole === 'admin') {
          navigate('/adminDashboard');
        } else {
          navigate('/userDashboard');
        }
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-20">
      <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
        {/* About Us Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome to Seat Nerd</h2>
          <p className="mb-6 text-lg">
            Your premier destination for movie theater seating. Book the perfect seat for your next cinematic experience.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Easy seat selection</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time availability</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant booking confirmation</span>
            </div>
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="md:w-1/2 bg-gray-800 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-white">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition duration-200"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    username: '',
                    role: 'user'
                  });
                }}
                className="text-red-500 font-medium hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageLoginAndSignup;