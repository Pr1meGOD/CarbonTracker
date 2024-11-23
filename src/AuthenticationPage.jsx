// AuthenticationPage.js
import React ,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bg from "./assets/Images/home_page_bg.jpg";
import { Leaf } from 'lucide-react';
// import ContactUs from './ContactUs';

const AuthenticationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Input validation to check if email and password fields are filled
    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch(
            isLoginMode ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Use 'username' instead of 'email' to match backend field names
                body: JSON.stringify({ username: email, password }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            setSuccessMessage(
                isLoginMode
                    ? 'Login successful! Redirecting to the tracking page...'
                    : 'Registration successful! Switching to login...'
            );

            if (isLoginMode) {
                // Simulate redirect after successful login
                setTimeout(() => {
                    navigate('/AccurateTrackingV3'); // Redirect to tracking page
                }, 2000);
            } else {
                // Switch to login mode after registration
                setTimeout(() => {
                    setIsLoginMode(true); // Toggle to login mode
                    setSuccessMessage(''); // Clear success message after switching
                }, 2000);
            }
        } else {
            setError(data.error || 'An error occurred during authentication.');
        }
    } catch (err) {
        setError('Something went wrong. Please try again.');
    }
};
  
const login = async (email, password) => {
  try {
      const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
          localStorage.setItem('authToken', data.token); // Save token
          console.log('Login successful!');
      } else {
          console.error('Login failed:', data.error);
      }
  } catch (err) {
      console.error('Something went wrong:', err);
  }
};


const saveCarEmission = async (carEmission, badge) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from storage

  try {
      const response = await fetch('http://localhost:5000/api/save-car-emission', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ carEmission, badge })
      });

      const data = await response.json();
      if (response.ok) {
          console.log('Emission data saved successfully:', data);
      } else {
          console.error('Error saving data:', data.error);
      }
  } catch (err) {
      console.error('Something went wrong:', err);
  }
};

// Example usage
saveCarEmission(0.7725, 'A');

  


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
                  <Link to = '/AboutUs' className="hover:text-green-400 cursor-pointer">About</Link>
                </li>
                <li>
                <Link to="/contact_us" className='hover:text-green-400 cursor-pointer'>Contact Us</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleSubmit} className="bg-black opacity-70 p-10 rounded shadow-xl w-96 px-15">
            <h2 className="text-2xl mb-4 text-white ">{isLoginMode ? 'Login' : 'Register'}</h2>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-800">{successMessage}</p>} {/* Display success message */}
            <div className="mb-4">
              <label className="block mb-2 text-white" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-500 p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-white" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-500 p-2 w-full"
              />
            </div>
            <button type="submit" className="bg-black text-white p-2 rounded w-20 ">
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <div className="mt-4">
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-white">
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
