import React from 'react';
import { Leaf, Users, Lightbulb, Github, Linkedin, Mail } from 'lucide-react';
import my_img from './assets/Images/atharva_manjrekar.jpg';
import atharva_palande from './assets/Images/atharva_palande.jpg';
import akshata from './assets/Images/akshata_bhavsar.jpg';
import {Link} from 'react-router-dom';
import bg from './assets/Images/home_page_bg.jpg';

const AboutUs = () => {
  const students = [
    {
      image: my_img,
      name: "Atharva Manjrekar",
      role: "Frontend Developer",
      github: "https://github.com/AtharvaManjrekar",
      linkedin: "https://www.linkedin.com/in/atharva-manjrekar-8b3193247/",
      email: "a.manjrekar@somaiya.edu"
    },
    {
      name: "Atharva Palande",
      role: "Backend Developer",
    //   bio: "Sam excels in server-side programming and database management. They have extensive experience with Node.js and PostgreSQL.",
      image: atharva_palande,
      github: "https://github.com/Pr1meGOD",
      linkedin: "https://www.linkedin.com/in/atharva-palande-3588682a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "palandeatharva22@gmail.com"
    },
    {
      name: "Akshata Bhavsar",
      role: "Backend Developer",
    //   bio: "Jordan brings expertise in data analysis and machine learning. They are skilled in Python and have a background in environmental science.",
      image: akshata,
      github: "https://github.com/Akshata-Bhavsar",
      linkedin: "https://www.linkedin.com/in/akshata-bhavsar-817069263?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "acbhavsar15@gmail.com"
    }
  ];

  return (
    <div
      className="min-h-screen w-screen h-screen flex flex-col relative bg-cover bg-center bg-no-repeat overflow-x-hidden"
    //   style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3432&q=80')" }}
    style={{ backgroundImage: `url(${bg})` }}
    >
      {/* <img src={bg} alt="Background" className="object-cover w-full h-full" /> */}
      {/* <div className="bg-black absolute top-0 right-0 left-0 w-full h-screen bg-opacity-45"></div> */}
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
                    <Link to='/AccurateTrackingV3' className='hover:text-green-400 cursor-pointer'>Track</Link>
                  
                </li>
                <li>
                <Link to="/contact_us" className='hover:text-green-400 cursor-pointer'>Contact Us</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-12 px-4 ">
          <h1 className="text-4xl font-bold mb-8 text-center">About CarbonTrack</h1>
          
          <div className="flex justify-center">
            <div className=" bg-opacity-90 p-8 rounded-lg shadow-lg mb-12 w-3/5  text-white bg-black opacity-90 ">
            <h2 className="text-2xl font-bold mb-4  flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-green-500" />
              Our Project
            </h2>
            <p className=" mb-4">
              CarbonTrack is an innovative web application designed to help individuals and organizations measure, understand, and reduce their carbon footprint. Our platform provides accurate tracking of various emission sources, including home energy use, transportation, food consumption, and travel.
            </p>
            <p className=" mb-4">
              Key features of CarbonTrack include:
            </p>
            <ul className="list-disc list-inside  mb-4">
              <li>Detailed carbon footprint calculator</li>
              <li>Personalized reduction tips</li>
              <li>Visual representation of emission data</li>
              <li>Educational resources on climate change</li>
              <li>Community engagement features</li>
            </ul>
            <p className="">
              Our goal is to empower users with the knowledge and tools they need to make environmentally conscious decisions and contribute to the global effort against climate change.
            </p>
          </div></div>

          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center ">
            <Users className="h-8 w-8 mr-2 " />
            Meet the Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {students.map((student, index) => (
              <div className="flex justify-around mt-5 ">
                <div key={index} className="bg-white  bg-opacity-90 p-6 rounded-lg shadow-lg w-3/5 hover:bg-black hover:text-white">
                <img src={student.image} alt={student.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold  text-center mb-2 ">{student.name}</h3>
                <p className="text-green-600 text-center mb-4 hover:text-white">{student.role}</p>
                {/* <p className="text-gray-700 text-center mb-4">{student.bio}</p> */}
                <div className="flex justify-center space-x-4">
                  <a href={student.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href={`mailto:${student.email}`} className="text-gray-600 hover:text-white">
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>
              </div>
            ))}
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

export default AboutUs;
