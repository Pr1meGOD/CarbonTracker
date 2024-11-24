import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null); // User information
  const [emissions, setEmissions] = useState(null); // Last emissions data

  // Simulate fetching user and emissions data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      // Replace with your actual backend API endpoint
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data);
    };

    const fetchEmissionsData = async () => {
      // Replace with your actual backend API endpoint
      const response = await fetch("/api/emissions/last");
      const data = await response.json();
      setEmissions(data);
    };

    fetchUserData();
    fetchEmissionsData();
  }, []);

  return (
    <div className="min-h-screen bg-black bg-opacity-90 text-white">
      <div className="container mx-auto py-8 px-6">
        {/* Welcome Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400">
            Welcome, {user?.email || "User"}!
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            Here's a summary of your most recent emissions data.
          </p>
        </header>

        {/* Emissions Data */}
        <main>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {emissions ? (
              <>
                {/* Car Emissions */}
                <EmissionCard
                  title="Car Emissions"
                  emission={emissions.car?.emission}
                  badge={emissions.car?.badge}
                />

                {/* Bike Emissions */}
                <EmissionCard
                  title="Bike Emissions"
                  emission={emissions.bike?.emission}
                  badge={emissions.bike?.badge}
                />

                {/* Household Emissions */}
                <EmissionCard
                  title="Household Emissions"
                  emission={emissions.household?.emission}
                  badge={emissions.household?.badge}
                />
              </>
            ) : (
              <p className="text-gray-300 col-span-full">
                Loading your emissions data...
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const EmissionCard = ({ title, emission, badge }) => {
  return (
    <div className="bg-black bg-opacity-30 hover:bg-opacity-100 transition-all duration-300 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-green-400 mb-2">{title}</h3>
      <p className="text-lg text-gray-200">Emission: {emission || "N/A"} metric tons CO₂</p>
      <p className="text-lg text-gray-200">
        Badge: <span className="font-bold text-green-400">{badge || "N/A"}</span>
      </p>
    </div>
  );
};

export default UserProfile;
