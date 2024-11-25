import React, { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import bg from "./assets/Images/home_page_bg.jpg";

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
    <div
      className="min-h-screen w-full flex flex-col relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black absolute top-0 right-0 left-0 w-full h-full bg-opacity-45"></div>
      <header className="relative top-0 bg-black bg-opacity-30 text-white p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center hover:text-green-400 transition-colors cursor-pointer">
            <Leaf className="mr-2" />
            CarbonTrack
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-green-400 cursor-pointer">Home</Link>
              </li>
              <li>
                <Link to="/AboutUs" className="hover:text-green-400 cursor-pointer">About</Link>
              </li>
              <li>
                <Link to="/contact_us" className="hover:text-green-400 cursor-pointer">Contact Us</Link>
              </li>
              <li>
                <Link to="/user-profile" className="hover:text-green-400 cursor-pointer">User Profile</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="flex-grow relative text-white z-10">
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
