import React from 'react';
import { Leaf, Home, Car, ShoppingBag, Lightbulb, Recycle } from 'lucide-react';
import bg from "./assets/Images/home_page_bg.jpg";
import { Link } from 'react-router-dom';

const CarbonReductionTips = () => {
  const tipCategories = [
    {
      title: "Home Energy",
      icon: <Home className="h-8 w-8 text-green-500" />,
      tips: [
        "Use energy-efficient LED light bulbs",
        "Improve home insulation to reduce heating/cooling needs",
        "Unplug electronics when not in use to avoid phantom energy consumption",
        "Use a programmable thermostat to optimize energy use",
        "Install solar panels if possible"
      ]
    },
    {
      title: "Transportation",
      icon: <Car className="h-8 w-8 text-green-500" />,
      tips: [
        "Use public transportation, bike, or walk when possible",
        "Carpool to reduce individual carbon footprints",
        "If driving, maintain your vehicle for optimal fuel efficiency",
        "Consider switching to an electric or hybrid vehicle",
        "Combine errands to reduce overall travel"
      ]
    },
    {
      title: "Consumption",
      icon: <ShoppingBag className="h-8 w-8 text-green-500" />,
      tips: [
        "Buy local and seasonal products to reduce transportation emissions",
        "Reduce meat consumption, especially beef",
        "Choose products with minimal packaging",
        "Bring reusable bags when shopping",
        "Invest in durable, long-lasting products instead of disposable ones"
      ]
    },
    {
      title: "Waste Reduction",
      icon: <Recycle className="h-8 w-8 text-green-500" />,
      tips: [
        "Recycle and compost whenever possible",
        "Avoid single-use plastics",
        "Donate or repurpose items instead of throwing them away",
        "Use a reusable water bottle and coffee cup",
        "Properly dispose of electronic waste"
      ]
    }
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
                {/* <li><span className="hover:text-green-400 transition-colors cursor-pointer">Tips</span></li> */}
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Carbon Reduction Tips</h1>
          <p className="text-xl mb-12 text-center max-w-3xl mx-auto">
            Reducing your carbon footprint doesn't have to be difficult. Here are some practical tips to help you make a positive impact on the environment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {tipCategories.map((category, index) => (
              <div key={index} className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h2 className="text-2xl font-bold ml-4 text-gray-800">{category.title}</h2>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Start Making a Difference Today!</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Every small action counts. By implementing these tips, you're contributing to a more sustainable future. Remember, the journey to reduce carbon emissions is ongoing, and your efforts make a real impact!
            </p>
            <Link to = '/AccurateTrackingV3'>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
              Track Your Progress
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

export default CarbonReductionTips;
