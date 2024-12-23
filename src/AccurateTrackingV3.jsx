import React, { useState, useEffect } from "react";
import { Leaf, Home, Car, Bike } from "lucide-react";
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

  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/AuthenticationPage"); 
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  
  const handleRedirectToTips = () => {
    navigate('/CarbonReductionTips');
  };

  async function saveEmissions(dataToSave) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/storeEmissions", {
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

      
      let dataToSave = {};

      if (activeCategory === "bike") {
        response = await axios.post(
          "http://localhost:5000/api/calculateBikeEmission",
          { cc: formData.bikeCC, monthlyMileage: formData.bikeMileage },
          { headers }
        );
        badge = response.data.badge;
        emissionValue = response.data.bikeEmission; 

        setResults((prevResults) => ({
          ...prevResults,
          bike: {
            bikeEmission: emissionValue,
            badge: badge,
          },
        }));

        dataToSave = {
          bikeEmissions: emissionValue, 
          bike_Badge: badge, 
        };

        await saveEmissions(dataToSave);

      } else if (activeCategory === "car") {
        response = await axios.post(
          "http://localhost:5000/api/calculateCarEmission",
          { carMileage: formData.carMileage, carFuelType: formData.carFuelType },
          { headers }
        );
        badge = response.data.badge;
        emissionValue = response.data.carEmission; 

        setResults((prevResults) => ({
          ...prevResults,
          car: {
            carEmission: emissionValue,
            badge: badge,
          },
        }));

        dataToSave = {
          carEmissions: emissionValue, 
          car_Badge: badge, 
        };

        await saveEmissions(dataToSave);

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
        emissionValue = response.data.homeEmission; 
    
        
        console.log("Home Emission Value:", emissionValue);
    
        setResults((prevResults) => ({
          ...prevResults,
          home: {
            homeEmission: emissionValue,
            badge: badge,
          },
        }));
    
        if (emissionValue !== undefined && emissionValue !== null) {
            dataToSave = {
              householdEmissions: emissionValue,  
              home_Badge: badge,  
            };
    
            await saveEmissions(dataToSave);
        } else {
            console.error("Error: Household emission value is missing or invalid.");
        }
    
    
   
      };
  
      
      setShowImprovementTip((prevTips) => ({
        ...prevTips,
        [activeCategory]: ["B", "C", "F"].includes(badge),
      }));
      
    } catch (error) {
      console.error("Error calculating emission:", error);
    }
  };

  const categories = [
    { id: "home", name: "Home", icon: <Home className="h-6 w-6" /> },
    { id: "car", name: "Car", icon: <Car className="h-6 w-6" /> },
    { id: "bike", name: "Bike", icon: <Bike className="h-6 w-6" /> },
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
                  <Link to="/" className="hover:text-green-400 cursor-pointer">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/AboutUs" className="hover:text-green-400 cursor-pointer">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact_us" className="hover:text-green-400 cursor-pointer">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/user-profile" className="hover:text-green-400 cursor-pointer">
                    User Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
  
        <main className="flex-grow container mx-auto py-12 px-4">
  <h1 className="text-4xl font-bold mb-8 text-center text-white">
    Accurate Carbon Footprint Tracking
  </h1>
  <p className="text-xl mb-12 text-center max-w-3xl mx-auto text-white">
    Track your carbon footprint with precision. Our advanced tools help you measure and
    understand your impact on the environment, including detailed calculations for various
    aspects of your lifestyle.
  </p>

  <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-center space-x-0 lg:space-x-8 space-y-8 lg:space-y-0">
    <div
      className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mx-auto"
      style={{ width: "80%", maxWidth: "800px" }}
    >
      <div className="flex mb-8 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center px-4 py-2 mr-4 rounded-full ${
              activeCategory === category.id
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-1">
        {activeCategory === "home" && (
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

        {activeCategory === "car" && (
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
                <option value="gasoline">Gasoline/Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
                <option value="petrol+cng">Petrol + CNG</option>
              </select>
            </div>
          </>
        )}

        {activeCategory === "bike" && (
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

      {results[activeCategory] && (
        <div className="mt-6 p-4 rounded bg-green-100 text-green-800">
          <p>
            Emission Result:{" "}
            {activeCategory === "home" && results.home?.homeEmission !== undefined
              ? `${results.home.homeEmission} metric tons CO₂`
              : activeCategory === "car" && results.car?.carEmission !== undefined
              ? `${results.car.carEmission} metric tons CO₂`
              : activeCategory === "bike" && results.bike?.bikeEmission !== undefined
              ? `${results.bike.bikeEmission} metric tons CO₂`
              : "No data available"}
          </p>
          <p>Badge: {results[activeCategory]?.badge || "No badge available"}</p>
        </div>
      )}

      {showImprovementTip[activeCategory] && (
        <div className="mt-6 bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-yellow-800 font-medium">
            Consider making lifestyle adjustments to improve your carbon emission score. Click
            the button below for tips.
          </p>
          <button
            onClick={handleRedirectToTips}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View Carbon Reduction Tips
          </button>
        </div>
      )}
    </div>

    <div className="w-full lg:w-2/5 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg text-left">
      <h2 className="text-2xl font-bold mb-4 text-green-500">Badge Information</h2>
      <ul className="space-y-4">
        <li>
          <span className="font-bold text-green-500">Badge S:</span> Excellent
        </li>
        <li>
          <span className="font-bold text-green-400">Badge A:</span> Great
        </li>
        <li>
          <span className="font-bold text-yellow-400">Badge B:</span> Fine
        </li>
        <li>
          <span className="font-bold text-orange-400">Badge C:</span> Need to Improve
        </li>
        <li>
          <span className="font-bold text-red-500">Badge F:</span> Severely Need Lifestyle Changes
        </li>
      </ul>
    </div>
  </div>
</main>

</div>
</div>

);
}

export default AccurateTrackingV3;
