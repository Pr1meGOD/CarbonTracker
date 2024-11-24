import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null); // User information
  const [emissions, setEmissions] = useState(null); // Last emissions data

  // Simulate fetching user and emissions data from the database
  useEffect(() => {
    // Replace these fetch calls with your actual backend endpoints
    const fetchUserData = async () => {
      const response = await fetch("/api/user"); // Replace with your API endpoint
      const data = await response.json();
      setUser(data);
    };

    const fetchEmissionsData = async () => {
      const response = await fetch("/api/emissions/last"); // Replace with your API endpoint
      const data = await response.json();
      setEmissions(data);
    };

    fetchUserData();
    fetchEmissionsData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Welcome Message */}
        <h1 className="text-2xl font-bold mb-6">
          Welcome, {user?.email || "User"}!
        </h1>

        {/* Emissions Data */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Last Emissions:</h2>
          {emissions ? (
            <div className="space-y-4">
              {/* Car Emissions */}
              <div className="p-4 bg-gray-50 rounded-lg shadow">
                <h3 className="font-semibold">Car Emissions:</h3>
                <p>Emission: {emissions.car?.emission || "N/A"} metric tons CO₂</p>
                <p>Badge: <span className="font-bold">{emissions.car?.badge || "N/A"}</span></p>
              </div>

              {/* Bike Emissions */}
              <div className="p-4 bg-gray-50 rounded-lg shadow">
                <h3 className="font-semibold">Bike Emissions:</h3>
                <p>Emission: {emissions.bike?.emission || "N/A"} metric tons CO₂</p>
                <p>Badge: <span className="font-bold">{emissions.bike?.badge || "N/A"}</span></p>
              </div>

              {/* Household Emissions */}
              <div className="p-4 bg-gray-50 rounded-lg shadow">
                <h3 className="font-semibold">Household Emissions:</h3>
                <p>
                  Emission: {emissions.household?.emission || "N/A"} metric tons CO₂
                </p>
                <p>Badge: <span className="font-bold">{emissions.household?.badge || "N/A"}</span></p>
              </div>
            </div>
          ) : (
            <p>Loading your emissions data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
