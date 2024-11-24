import React, { useState, useEffect } from "react";
import { Leaf, Home, Car, Bike, ShoppingBag, Plane } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "./assets/Images/home_page_bg.jpg";

const AccurateTrackingV3 = () => {
  const [activeCategory, setActiveCategory] = useState("home");
  const [formData, setFormData] = useState({
    electricity: "",
    heating: "",
    carMileage: "",
    carFuelType: "",
    bikeMileage: "",
    bikeCC: "",
    meatConsumption: "",
    flights: "",
  });
  const [results, setResults] = useState({
    home: null,
    car: null,
    bike: null,
  });
  const [showImprovementTip, setShowImprovementTip] = useState({
    home: false,
    car: false,
    bike: false,
  });
  const navigate = useNavigate();

  // Ensure user is logged in using JWT
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/AuthenticationPage"); // Redirect to login if no token found
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to redirect to tips page
  const handleRedirectToTips = () => {
    navigate('/CarbonReductionTips');
  };

  // Save emissions data to the backend
  async function saveEmissions(dataToSave) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await fetch("/api/storeEmissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Emission data saved successfully:", result.message);
      } else {
        console.error("Failed to save emission data:", result.error);
      }
    } catch (error) {
      console.error("Error while saving emissions:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      let response;
      const headers = { Authorization: `Bearer ${token}` };
      let badge, emissionValue;

      if (activeCategory === "bike") {
        response = await axios.post(
          "http://localhost:5000/api/calculateBikeEmission",
          { cc: formData.bikeCC, monthlyMileage: formData.bikeMileage },
          { headers }
        );
        badge = response.data.badge;
        emissionValue = response.data.emissionValue;

        setResults((prevResults) => ({
          ...prevResults,
          bike: { bikeEmission: emissionValue, badge },
        }));

        await saveEmissions({ bikeEmissions: emissionValue, bike_badge: badge });
      } else if (activeCategory === "car") {
        response = await axios.post(
          "http://localhost:5000/api/calculateCarEmission",
          { carMileage: formData.carMileage, carFuelType: formData.carFuelType },
          { headers }
        );
        badge = response.data.badge;
        emissionValue = response.data.emissionValue;

        setResults((prevResults) => ({
          ...prevResults,
          car: { carEmission: emissionValue, badge },
        }));

        await saveEmissions({ carEmissions: emissionValue, car_badge: badge });
      } else if (activeCategory === "home") {
        response = await axios.post(
          "http://localhost:5000/api/calculateHomeEmission",
          {
            electricityUsage: formData.electricity,
            heatingUsage: formData.heating,
          },
          { headers }
        );
        badge = response.data.badge;
        emissionValue = response.data.emissionValue;

        setResults((prevResults) => ({
          ...prevResults,
          home: { homeEmission: emissionValue, badge },
        }));

        await saveEmissions({ household_emissions: emissionValue, home_badge: badge });
      }

      setResults((prevResults) => ({
        ...prevResults,
        [activeCategory]: {
          homeEmission: response.data.homeEmission,
          carEmission: response.data.carEmission,
          bikeEmission: response.data.bikeEmission,
          badge: response.data.badge,
        },
      }));

      // Show improvement tips based on badge
      setShowImprovementTip((prevTips) => ({
        ...prevTips,
        [activeCategory]: ["B", "C", "F"].includes(badge),
      }));

      // Redirect to tips page if necessary
      if (["B", "C", "F"].includes(badge)) {
        handleRedirectToTips();
      }
    } catch (error) {
      console.error("Error calculating emission:", error);
    }
  };

  const categories = [
    { id: "home", name: "Home", icon: <Home className="h-6 w-6" /> },
    { id: "car", name: "Car", icon: <Car className="h-6 w-6" /> },
    { id: "bike", name: "Bike", icon: <Bike className="h-6 w-6" /> },
    { id: "food", name: "Food", icon: <ShoppingBag className="h-6 w-6" /> },
    { id: "flight", name: "Flight", icon: <Plane className="h-6 w-6" /> },
  ];



  return (
    <div
      className="min-h-screen w-screen h-screen flex flex-col relative bg-cover bg-center bg-no-repeat overflow-x-hidden overflow-y-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black absolute top-0 right-0 left-0 w-full h-full bg-opacity-45">
        <header className="top-0 bg-black bg-opacity-30 text-white p-4">
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
              </ul>
            </nav>
          </div>
        </header>
  
        <main className="flex-grow container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">Accurate Carbon Footprint Tracking</h1>
          <p className="text-xl mb-12 text-center max-w-3xl mx-auto text-white">
            Track your carbon footprint with precision. Our advanced tools help you measure and understand your impact on the environment, including detailed calculations for various aspects of your lifestyle.
          </p>
  
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mx-auto" style={{ width: '80%', maxWidth: '800px' }}>
          <div className="flex mb-8 overflow-x-auto">
  {categories.map((category) => (
    <button
      key={category.id}
      className={`flex items-center px-4 py-2 mr-4 rounded-full ${
        activeCategory === category.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
      }`}
      onClick={() => setActiveCategory(category.id)}
    >
      {category.icon}
      <span className="ml-2">{category.name}</span>
    </button>
  ))}
</div>


  
            {/* Form goes here */}
            <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-1">
            {activeCategory === 'home' && (
  <>
    <div>
      <label htmlFor="electricity" className="block text-sm font-medium text-black">
        Monthly Electricity Usage (kWh)
      </label>
      <input
        type="number"
        id="electricity"
        name="electricity"
        value={formData.electricity || ""}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black p-2"
      />
    </div>
    <div>
      <label htmlFor="heating" className="block text-sm font-medium text-black">
        Monthly Heating Usage (therms)
      </label>
      <input
        type="number"
        id="heating"
        name="heating"
        value={formData.heating || ""}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black p-2"
      />
    </div>
  </>
)}

              {activeCategory === 'car' && (
                <>
                  <div>
                    <label htmlFor="carMileage" className="block text-sm font-medium text-black">
                      Monthly Car Mileage (in miles)
                    </label>
                    <input
                      type="number"
                      id="carMileage"
                      name="carMileage"
                      value={formData.carMileage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="carFuelType" className="block text-sm font-medium text-black">
                      Car Fuel Type
                    </label>
                    <select
                      id="carFuelType"
                      name="carFuelType"
                      value={formData.carFuelType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black p-2"
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                </>
              )}
              {activeCategory === 'bike' && (
                <>
                  <div>
                    <label htmlFor="bikeCC" className="block text-sm font-medium text-black">
                      Bike Engine CC
                    </label>
                    <input
                      type="number"
                      id="bikeCC"
                      name="bikeCC"
                      value={formData.bikeCC}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="bikeMileage" className="block text-sm font-medium text-black">
                      Monthly Mileage (in miles)
                    </label>
                    <input
                      type="number"
                      id="bikeMileage"
                      name="bikeMileage"
                      value={formData.bikeMileage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-black p-2"
                    />
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-md bg-green-500 text-white hover:bg-green-700 transition-colors"
              >
                Calculate Emission
              </button>
            </form>
  
          {/* Emission result display */}
          {results[activeCategory] && (
  <div className="mt-6 p-4 rounded bg-green-100 text-green-800">
    <p>
      Emission Result: 
      {activeCategory === 'home' && results[activeCategory].homeEmission
        ? `${results[activeCategory].homeEmission} metric tons CO₂`
        : activeCategory === 'car' && results[activeCategory].carEmission
        ? `${results[activeCategory].carEmission} metric tons CO₂`
        : activeCategory === 'bike' && results[activeCategory].bikeEmission
        ? `${results[activeCategory].bikeEmission} metric tons CO₂`
        : 'No data available'}
    </p>
    <p>Badge: {results[activeCategory].badge}</p>
  </div>
)}



            
            {/* Show improvement tip */}
            {showImprovementTip[activeCategory] && (
              <div className="mt-6 bg-yellow-100 p-4 rounded-lg text-center">
                <p className="text-yellow-800 font-medium">
                  Consider making lifestyle adjustments to improve your carbon emission score. Click the button below for tips.
                </p>
                <form onSubmit={handleSubmit}>
      {/* Add form fields and category-specific inputs here */}
      <button type="submit">Calculate Emissions</button>
    </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );};


  export default AccurateTrackingV3; 
