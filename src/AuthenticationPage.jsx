import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bg from "./assets/Images/home_page_bg.jpg";
import { Leaf } from 'lucide-react';

const AuthenticationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState(''); // Tracks the "user_name" field
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password || (!isLoginMode && (!userName || !confirmPassword))) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Include "user_name" explicitly in the payload for registration
      const payload = isLoginMode
        ? { username: email, password } // Login payload
        : { user_name: userName, username: email, password }; // Registration payload

      const response = await fetch(
        isLoginMode ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), // Send the payload to the backend
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);

        setSuccessMessage(
          isLoginMode
            ? 'Login successful! Redirecting to the tracking page...'
            : 'Registration successful! Switching to login...'
        );

        if (isLoginMode) {
          setTimeout(() => navigate('/AccurateTrackingV3'), 2000);
        } else {
          setTimeout(() => {
            setIsLoginMode(true);
            setSuccessMessage('');
          }, 2000);
        }
      } else {
        setError(data.error || 'An error occurred during authentication.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen w-screen h-screen flex flex-col relative bg-cover bg-center bg-no-repeat overflow-x-hidden overflow-y-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <img src={bg} alt="Background" className="object-cover w-full h-full" />
      <div className="bg-black absolute top-0 right-0 left-0 w-full h-full bg-opacity-45"></div>
      <div className="absolute top-0 left-0 right-0">
        <header className="top-0 bg-black bg-opacity-30 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center">
              <Leaf className="mr-2" />
              CarbonTrack
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:text-green-400 cursor-pointer">Home</Link>
                </li>
                <li>
                  <Link to="/AboutUs" className="hover:text-green-400 cursor-pointer">About</Link>
                </li>
                <li>
                  <Link to="/contact_us" className="hover:text-green-400 cursor-pointer">Contact Us</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleSubmit} className="bg-black opacity-80 p-10 rounded shadow-xl w-128 px-15">
            <h2 className="text-3xl mb-6 text-white font-bold text-center">
              {isLoginMode ? 'Login' : 'Register'}
            </h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

            {!isLoginMode && (
              <div className="mb-6">
                <label className="block mb-2 text-white font-medium" htmlFor="userName">Username</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="border border-gray-500 p-3 rounded-lg w-[30rem]" // Increased width
                />
              </div>
            )}
            <div className="mb-6">
              <label className="block mb-2 text-white font-medium" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-500 p-3 rounded-lg w-[30rem]" // Increased width
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-white font-medium" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-500 p-3 rounded-lg w-[30rem]" // Increased width
              />
            </div>
            {!isLoginMode && (
              <div className="mb-6">
                <label className="block mb-2 text-white font-medium" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border border-gray-500 p-3 rounded-lg w-[30rem]" // Increased width
                />
              </div>
            )}
            <button type="submit" className="bg-green-600 text-white p-3 rounded-lg w-full font-medium">
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <div className="mt-6 text-center">
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-green-400 font-medium">
                Switch to {isLoginMode ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
