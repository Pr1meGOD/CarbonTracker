import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const UserProfile = ({ user }) => {
  // Mock data fetching function to get the user's last calculated emissions
  const fetchUserEmissionData = async () => {
    // Replace this with an actual API/database call
    return {
      email: user?.email || "example@domain.com",
      lastEmissions: {
        household: {
          value: 2.5, // Example: 2.5 metric tons CO₂
          badge: "Green Saver", // Badge earned
        },
      },
    };
  };

  const [userData, setUserData] = useState({
    email: "",
    lastEmissions: {},
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUserEmissionData();
      setUserData(data);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100 p-4">
      <header className="bg-green-600 text-white py-4 px-6 rounded shadow-md">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </header>
      <main className="container mx-auto mt-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userData.email}!</h2>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Last Calculated Emissions:</h3>
            {userData.lastEmissions.household ? (
              <div className="mt-2 p-4 bg-green-100 text-green-800 rounded-md">
                <p>
                  <strong>Household Emissions:</strong>{" "}
                  {userData.lastEmissions.household.value} metric tons CO₂
                </p>
                <p>
                  <strong>Badge Earned:</strong> {userData.lastEmissions.household.badge}
                </p>
              </div>
            ) : (
              <p>No emissions data available. Start tracking your carbon footprint today!</p>
            )}
          </div>

          <button
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => {
                <Link to="/accurateTrackingV3"></Link> 
            }}
          >
            Track More Emissions
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
