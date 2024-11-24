import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AuthenticationPage from './AuthenticationPage';
import ContactUs from './ContactUs';
import CarbonReductionTips from './CarbonReductionTips';
import GlobalCarbonImpact from './GlobalCarbonImpact';
import AccurateTrackingV3 from './AccurateTrackingV3';
import AboutUs from './AboutUs';
import ChatPage from './ChatPage';
import UserProfile from './UserProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/carbonReductionTips" element={<CarbonReductionTips />} />
        <Route path="/globalCarbonImpact" element={<GlobalCarbonImpact />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/accurateTrackingV3" element={<AccurateTrackingV3 />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path='/user-profile' element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
