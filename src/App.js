import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import UserDashboard from './Pages/UserDashboard/UserDashboard';
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path = '/' element={<LandingPage/>}/>
          <Route path = '/adminDashboard' element={<AdminDashboard/>}/>
          <Route path = '/userDashboard' element={<UserDashboard/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

