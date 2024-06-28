// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const token = Cookies.get('jwtToken');
  if (token === undefined) {
    return <Navigate to="/" />;
  }
  return <Route {...rest} element={<Element />} />;
};

export default ProtectedRoute;