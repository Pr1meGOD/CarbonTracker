import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, BarChart2, Globe, Users } from 'lucide-react';
import bg from './assets/Images/home_page_bg.jpg';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const loggedInState = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInState === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <div
      className="min-h-screen w-screen h-screen flex flex-col relative bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <img src={bg} alt="Background" className="object-cover w-full h-full" />
      <div className="bg-black absolute top-0 right-0 left-0 w-full h-full bg-opacity-45"></div>

      <div className="absolute top-0 left-0 right-0">
        <header className="top-0 bg-black bg-opacity-30 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center hover:text-green-400 transition-colors cursor-pointer">
              <Leaf className="mr-2 hover:text-green-400 transition-colors cursor-pointer" />
              CarbonTrack
            </div>
            <nav>
              <ul className="flex space-x-4">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link to="/user-profile" className="hover:text-green-400 cursor-pointer">
                        User Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="hover:text-green-400 cursor-pointer"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/auth" className="hover:text-green-400 cursor-pointer">
                      Register / Login
                    </Link>
                  </li>
                )}
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
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <section className="hero container mx-auto text-center text-white py-20">
            <h1 className="text-5xl font-bold mb-4">Track Your Carbon Footprint</h1>
            <p className="text-xl mb-8">
              Make a positive impact on the environment with our advanced carbon tracking system
            </p>
            <div
              className="hover:bg-green-950 hover:text-white text-green-400 hover:border-transparent border-green-400 border-2 py-2 px-6 rounded-lg text-lg inline-block cursor-pointer"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </div>
          </section>

          <section id="features" className="features container mx-auto p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer">
              <Link to="/AccurateTrackingV3">
                <FeatureCard
                  icon={<BarChart2 className="h-12 w-12 text-green-500" />}
                  title="Accurate Tracking"
                  description="Precise measurement of your carbon emissions across various activities"
                />
              </Link>
              <Link to="/GlobalCarbonImpact">
                <FeatureCard
                  icon={<Globe className="h-12 w-12 text-green-500" />}
                  title="Global Impact"
                  description="See how your efforts contribute to worldwide sustainability goals"
                />
              </Link>
              <Link to="/CarbonReductionTips">
                <FeatureCard
                  icon={<Leaf className="h-12 w-12 text-green-500" />}
                  title="Eco-friendly Tips"
                  description="Receive personalized suggestions to reduce your carbon footprint"
                />
              </Link>

              <Link to="/chat">
                <FeatureCard
                  icon={<Users className="h-12 w-12 text-green-500" />}
                  title="Ask your Doubts Here"
                  description="Connect with AI and get answers to your questions"
                />
              </Link>
            </div>
          </section>
        </main>
      </div>

      <footer className="bg-black bg-opacity-100 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 CarbonTrack. All rights reserved.</p>
          <div className="mt-4">
            <div className="hover:text-green-400 mr-4 cursor-pointer">Privacy Policy</div>
            <div className="hover:text-green-400 cursor-pointer">Terms of Service</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-black bg-opacity-30 hover:bg-opacity-100 transition-all duration-300 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white text-center">{title}</h3>
      <p className="text-gray-200 text-center">{description}</p>
    </div>
  );
};

export default HomePage;
