import React, { useState } from 'react';
import { Leaf, Award, BarChart2, TrendingDown, Calendar, Edit, LogOut } from 'lucide-react';
import bg from "./assets/Images/home_page_bg.jpg";
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate(); // React Router's navigate hook for redirecting

  // State for user profile data
  const [user, setUser] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    // joinDate: "January 15, 2024",
    avatar: "https://images.pexels.com/photos/26926485/pexels-photo-26926485/free-photo-of-young-man-posing-in-eyeglasses-and-white-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Random image from Unsplash
  });

  const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);

  const achievements = [
    { title: "Carbon Reducer", description: "Reduced carbon footprint by 20%", date: "2024-03-15" },
    { title: "Eco Warrior", description: "Completed 10 sustainability challenges", date: "2024-02-28" },
    { title: "Green Commuter", description: "Used public transport for a month", date: "2024-01-31" },
  ];

  const carbonData = {
    currentFootprint: 7.2,
    reduction: 1.8,
    goal: 5.0,
  };

  const progressWidth = Math.max(
    Math.min(
      ((carbonData.currentFootprint - carbonData.goal) /
        (carbonData.currentFootprint + carbonData.reduction - carbonData.goal)) *
        100,
      100
    ),
    0
  );

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setUser((prevUser) => ({
      ...prevUser,
      name: newName,
      email: newEmail,
    }));
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Clear session or authentication token if any
    console.log("Logging out...");
    navigate('/auth'); // Redirect to login page after logout
  };

  const calculate_carbon = () =>{
    console.log("Navigating to carbon calculation page");
    navigate('/AccurateTrackingV3');
  };

  return (
    <div
      className="flex flex-col min-h-screen relative bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-45 z-0"></div>

      <header className="top-0 bg-black bg-opacity-30 text-white p-4 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center">
            <Leaf className="mr-2" />
            CarbonTrack
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-green-400 cursor-pointer">Home</Link></li>
              <li><Link to="/AboutUs" className="hover:text-green-400 cursor-pointer">About</Link></li>
              <li><Link to="/contact_us" className="hover:text-green-400 cursor-pointer">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content section */}
      <main className="flex-grow container mx-auto py-12 px-4 mt-5 relative z-10">
        <div className="max-w-screen-md mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8"
            />
            <div className="text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={isEditing ? handleSaveClick : handleEditClick}
              className="mt-4 md:mt-0 md:ml-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center mr-5"
            >
              <Edit className="h-4 w-4 mr-2" aria-label="Edit Profile Icon" />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
              
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" aria-label="Logout Icon" />
              Logout
            </button>
          
          </div>

          {/* Move Logout button upwards */}
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <Award className="h-6 w-6 mr-2 text-green-500" aria-label="Achievements Icon" />
                Achievements
              </h2>
              <ul className="space-y-4">
                {achievements.map((achievement, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                    <p className="text-sm text-gray-500 mt-2">{achievement.date}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <BarChart2 className="h-6 w-6 mr-2 text-green-500" aria-label="Carbon Footprint Icon" />
                Carbon Footprint
              </h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="mb-4">
                  <p className="text-gray-600">Current Footprint</p>
                  <p className="text-3xl font-bold text-gray-800">{carbonData.currentFootprint} tons CO2e/year</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Reduction</p>
                  <p className="text-2xl font-bold text-green-500 flex items-center">
                    <TrendingDown className="h-5 w-5 mr-2" aria-label="Reduction Icon" />
                    {carbonData.reduction} tons CO2e
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Goal</p>
                  <p className="text-2xl font-bold text-blue-500">{carbonData.goal} tons CO2e/year</p>
                </div>
              </div>

                <div className="calculate_carbon mt-6 text-center p-3 bg-green-500  text-white rounded-lg ">
                    <button className='text-xl' onClick={calculate_carbon}>Calculate your Carbon Now!!</button>
                </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;