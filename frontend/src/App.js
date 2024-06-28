import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './App.css';
import NavBar from './components/navbar/index';
import Registration from './components/registration';
import LoginForm from './components/signup';
import NavBar1 from './navbar1';
import HomePage from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [jwtToken, setJwtToken] = useState(Cookies.get("jwtToken"));

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    setJwtToken(token);
  }, []);

  const handleTokenChange = (newToken) => {
    setJwtToken(newToken);
  };

  return (
    <div className="App">
      {jwtToken !== undefined ? <NavBar1 onTokenChange={handleTokenChange} /> : <NavBar onTokenChange={handleTokenChange} />}
      <Routes>
        <Route exact path="/" element={<LoginForm onTokenChange={handleTokenChange} />} />
        <Route exact path="/register" element={<Registration onTokenChange={handleTokenChange} />} />
        <Route exact path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
