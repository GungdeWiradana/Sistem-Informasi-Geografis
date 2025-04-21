import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MapPage from './pages/MapPage';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/map" element={isAuthenticated ? <MapPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
