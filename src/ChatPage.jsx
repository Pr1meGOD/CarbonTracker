import React, { useState, useRef, useEffect } from 'react';
import { Leaf, Send, Bot, User } from 'lucide-react';
import bg from './assets/Images/home_page_bg.jpg';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', content: "Hello! I'm CarbonBot, your AI assistant for all things related to carbon footprint and sustainability. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
    setLoading(true); // Start loading

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setLoading(false); // End loading
    }, 1000);
  };

  const getAIResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();
    if (lowercaseInput.includes('carbon footprint')) {
      return "Your carbon footprint is the total amount of greenhouse gases produced by your activities. This includes direct emissions like driving a car, and indirect emissions from the products you buy and use.";
    } else if (lowercaseInput.includes('reduce emissions')) {
      return "There are many ways to reduce your emissions! Some tips include: using public transportation, reducing meat consumption, improving home energy efficiency, and choosing renewable energy sources when possible.";
    } else if (lowercaseInput.includes('climate change')) {
      return "Climate change refers to long-term shifts in global weather patterns and average temperatures. It's primarily caused by human activities that release greenhouse gases into the atmosphere, such as burning fossil fuels.";
    } else {
      return "That's an interesting question! While I don't have specific information on that topic, I'd be happy to discuss general concepts about carbon footprint, sustainability, and climate change. Is there a particular area you'd like to know more about?";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white"
       style={{ backgroundImage: `url(${bg})` }}
         >
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
                <Link to = '/AccurateTrackingV3' className='hover:text-green-400 cursor-pointer'>Track</Link>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-12 px-4 flex flex-col items-center"> {/* Centered flex column */}
          <h1 className="text-4xl font-bold mb-8 text-center">Talk with CarbonBot</h1>
          
          <div className="flex w-full justify-center"> {/* Full width for centering */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg mb-6 overflow-hidden flex flex-col max-w-2xl w-full opacity-85"> {/* Set max width */}
              <div className="flex-grow overflow-y-auto mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-3/4 p-3 rounded-lg ${message.type === 'user' ? 'bg-green-500 text-white ' : 'bg-black text-white opacity-80'}`}>
                      <div className="flex items-center mb-2">
                        {message.type === 'ai' ? <Bot className="h-5 w-5 mr-2" /> : <User className="h-5 w-5 mr-2" />}
                        <span className="font-bold">{message.type === 'ai' ? 'CarbonBot' : 'You'}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {loading && <p className="text-gray-500">CarbonBot is typing...</p>}
              
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Explore Sustainability with AI</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Chat with CarbonBot to learn more about reducing your carbon footprint, understanding climate change, and making sustainable choices. Our AI assistant is here to answer your questions and provide helpful insights.
            </p>
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

export default ChatPage;
