import React from 'react';
import { Navigate } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login/login';
import Register from './component/Register/register';
import Profile from './component/Profile/profile';
import Media from './component/Media/media';
import Detail from './component/Detail/detail';
import Edit from './component/EditImage/editImage';

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const ProtectedRoute = ({ element: Component }) => {
    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
  };
  <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/media"
          element={<ProtectedRoute element={Media} />}
        />
        <Route
          path="/detail/:imageId"
          element={<ProtectedRoute element={Detail} />}
        />
        <Route
          path="/detail/:imageId/edit"
          element={<ProtectedRoute element={Edit} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

