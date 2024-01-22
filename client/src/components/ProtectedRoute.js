import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth();

  console.log("ProtectedRoute, token:", token);

  return (
    <Route {...rest} render={props => {
      console.log("ProtectedRoute render, token:", token);
      console.log("Trying to access:", props.location.pathname);

      if (token) {
        console.log("Rendering Component in ProtectedRoute");

        return <Component {...props} />;
      } else {
        console.log("Redirecting to login from ProtectedRoute");
        return <Redirect to={{
          pathname: "/login",
          state: { from: props.location }
        }} />;
      }
    }} />
  );
};

export default ProtectedRoute;
