import React from 'react';
import { Link } from 'react-router-dom';
import bg from "./assets/Images/home_page_bg.jpg";
import { Leaf } from 'lucide-react';

function ContactUs() {
  return (
    <div
      className="min-h-screen w-screen h-screen flex flex-col relative bg-cover bg-center bg-no-repeat overflow-x-hidden overflow-y-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black absolute top-0 right-0 left-0 w-full h-full bg-opacity-65"></div>

      <div className="absolute top-0 left-0 right-0">
        <header className="top-0 bg-black bg-opacity-30 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center  hover:text-green-400 transition-colors cursor-pointer">
              <Leaf className="mr-2  hover:text-green-400 transition-colors cursor-pointer" />
              CarbonTrack
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:text-green-400 cursor-pointer">Home</Link>
                </li>
                <li>
                  <Link to = '/AboutUs' className="hover:text-green-400 cursor-pointer">About</Link>
                </li>
                <li>
                <Link to="/user-profile" className="hover:text-green-400 cursor-pointer">User Profile</Link>
              </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="flex flex-row justify-center items-center h-screen px-8">
          {/* Left Side - Map */}
          <div className="w-1/2 p-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.4018164952095!2d72.86850597466452!3d19.046063052912654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf21727f6e19%3A0x473006136ad440dc!2sK.%20J.%20Somaiya%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1730445080634!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Right Side - Contact Information */}
          <div className="w-1/2 p-4 text-white flex flex-col items-start">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg mb-2">
              Phone: 
              <a href="tel:+9594257690" className="hover:text-green-400"> 9594257690</a> / 
              <a href="tel:+9029505200" className="hover:text-green-400"> 9029505200</a> / 
              <a href="tel:+9022633616" className="hover:text-green-400"> 9022633616</a>
            </p>
            <p className="text-lg mb-2">
              Email: <a href="mailto:carbontracker054@gmail.com" className="hover:text-green-400">carbontracker054@gmail.com</a>
            </p>
            <p className="text-lg">Address: K. J. Somaiya Institute of Technology, Mumbai, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
