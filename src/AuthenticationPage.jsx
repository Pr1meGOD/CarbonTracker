
import React ,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bg from "./assets/Images/home_page_bg.jpg";
import { Leaf } from 'lucide-react';

const AuthenticationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
  
    try {
      let response;
      const headers = { Authorization: `Bearer ${token}` };
  
      // Calculate emissions based on the active category
      if (activeCategory === 'bike') {
        response = await axios.post(
          'http://localhost:5000/api/calculateBikeEmission',
          { cc: formData.bikeCC, monthlyMileage: formData.bikeMileage },
          { headers }
        );
      } else if (activeCategory === 'car') {
        response = await axios.post(
          'http://localhost:5000/api/calculateCarEmission',
          { carMileage: formData.carMileage, carFuelType: formData.carFuelType },
          { headers }
        );
      } else if (activeCategory === 'home') {
        response = await axios.post(
          'http://localhost:5000/api/calculateHomeEmission',
          { electricityUsage: formData.electricity, heatingUsage: formData.heating },
          { headers }
        );
      }
  
      // Extract badge and emission value from the response
      const { badge, emissionValue } = response.data;
  
      // Update the results state to display on the UI
      setResults((prevResults) => ({
        ...prevResults,
        [activeCategory]: {
          emissionValue, // calculated emission value
          badge,         // corresponding badge
        },
      }));
  
      // Show improvement tips based on the badge
      setShowImprovementTip((prevTips) => ({
        home: activeCategory === 'home' ? ['B', 'C', 'F'].includes(badge) : false,
        car: activeCategory === 'car' ? ['B', 'C', 'F'].includes(badge) : false,
        bike: activeCategory === 'bike' ? ['B', 'C', 'F'].includes(badge) : false,
      }));
  
      // Send the emission data to the backend for storage
      const storeResponse = await fetch('http://localhost:5000/api/storeEmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          emissionType: activeCategory, // Pass the active category (car, bike, home)
          emissionValue: emissionValue, // Pass the calculated emission value
          badge: badge,                 // Pass the badge
        }),
      });
  
      const storeData = await storeResponse.json();
      if (storeData.error) {
        console.error('Error storing emission data:', storeData.error);
      } else {
        console.log('Emission data stored successfully');
      }
  
    } catch (error) {
      console.error('Error calculating emission:', error);
    }
  };
  


  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token); // Save JWT token in localStorage
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const saveEmissionData = async (emissionType, emissionValue, badge) => {
    const token = localStorage.getItem('authToken'); // Retrieve the JWT token

    try {
      const response = await fetch('http://localhost:5000/api/storeEmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Corrected syntax for Bearer token
        },
        body: JSON.stringify({
          emissionType,
          emissionValue,
          badge,
        }),
      });

      const result = await response.json();
      console.log(result); // Log the result or handle the UI update
    } catch (error) {
      console.error('Error saving emission data:', error);
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
