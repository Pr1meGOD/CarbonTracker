import React from 'react';
import { Leaf, ThermometerSun, Droplets, TreeDeciduous, Wind, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import bg from "./assets/Images/home_page_bg.jpg";

const GlobalCarbonImpact = () => {
  const impactData = [
    { label: "Global Temperature Increase", value: "1.1°C", icon: <ThermometerSun className="h-8 w-8 text-red-500" /> },
    { label: "Sea Level Rise", value: "3.3 mm/year", icon: <Droplets className="h-8 w-8 text-blue-500" /> },
    { label: "Forest Area Loss", value: "10 million ha/year", icon: <TreeDeciduous className="h-8 w-8 text-green-500" /> },
    { label: "Extreme Weather Events", value: "+20% since 1980", icon: <Wind className="h-8 w-8 text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white"
    style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-black bg-opacity-50 min-h-screen flex flex-col">
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
                  <Link to = '/AboutUs' className="hover:text-green-400 cursor-pointer">About</Link>
                </li>
                <li>
                <Link to="/contact_us" className='hover:text-green-400 cursor-pointer'>Contact Us</Link>
                </li>
                {/* <li><span className="hover:text-green-400 transition-colors cursor-pointer">Impact</span></li> */}
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Global Impact of Carbon Emissions</h1>
          <p className="text-xl mb-12 text-center max-w-3xl mx-auto">
            Carbon emissions have far-reaching consequences on our planet's climate, ecosystems, and human societies. Here's an overview of the global impact:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-32 mb-12">
            {impactData.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{item.label}</h3>
                <p className="text-3xl font-bold text-gray-700">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-around">
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mb-12 w-5/12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Key Areas of Impact</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2 mt-1 flex-shrink-0" />
                <span><strong>Climate Change:</strong> Increased greenhouse gas emissions are leading to global warming, altering weather patterns, and causing more frequent extreme weather events.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2 mt-1 flex-shrink-0" />
                <span><strong>Ocean Acidification:</strong> As oceans absorb more CO2, they become more acidic, threatening marine ecosystems and biodiversity.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2 mt-1 flex-shrink-0" />
                <span><strong>Melting Ice Caps:</strong> Rising temperatures are causing polar ice caps to melt at an alarming rate, contributing to sea-level rise and habitat loss.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2 mt-1 flex-shrink-0" />
                <span><strong>Biodiversity Loss:</strong> Changing climates are forcing species to adapt or migrate, leading to ecosystem disruptions and potential extinctions.</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2 mt-1 flex-shrink-0" />
                <span><strong>Food Security:</strong> Changing weather patterns and extreme events are affecting crop yields and food production globally.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mb-12 w-5/12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Global Carbon Emissions by Sector</h2>
            <div className="h-64 flex items-end justify-around">
              <div className="w-1/5 bg-blue-500 h-3/4" title="Energy (35%)"></div>
              <div className="w-1/5 bg-green-500 h-1/2" title="Agriculture (24%)"></div>
              <div className="w-1/5 bg-yellow-500 h-2/5" title="Industry (21%)"></div>
              <div className="w-1/5 bg-red-500 h-1/4" title="Transport (14%)"></div>
              <div className="w-1/5 bg-purple-500 h-1/6" title="Buildings (6%)"></div>
            </div>
            <div className="flex justify-around mt-2 text-sm text-gray-600">
              <span>Energy</span>
              <span>Agriculture</span>
              <span>Industry</span>
              <span>Transport</span>
              <span>Buildings</span>
            </div>
          </div>
          
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Take Action Now</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              The global impact of carbon emissions is significant, but there's still time to make a difference. By reducing our individual carbon footprints and supporting sustainable practices, we can work towards a cleaner, healthier planet.
            </p>
            <Link to = '/AccurateTrackingV3'>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
              Calculate Your Carbon Footprint
            </button>
            </Link>
          </div>
        </main>

        <footer className="py-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 CarbonTrack. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GlobalCarbonImpact;
