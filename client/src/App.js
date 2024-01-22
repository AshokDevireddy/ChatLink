import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import BusinessDashboard from './pages/BusinessDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import OrderSubmissionPage from './pages/OrderSubmissionPage';
import { AuthContext } from './context/AuthContext';
import './App.css';

const TokenHandler = () => {
  const { setToken } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    console.log("urlParams", urlParams.toString());
    console.log("token", token);
    if (token) {
      setToken(token);
    }
  }, [location, setToken]);

  return null; // This component does not render anything
};

function App() {
  const { token } = useContext(AuthContext);

  console.log("App.js, current token:", token);

  return (
    <Router>
      <TokenHandler />
      <Switch>
        <Route path="/" exact>
          {console.log("Root Route, Redirecting to:", token ? "/dashboard" : "/login")}
          <Redirect to={token ? "/dashboard" : "/login"} />
        </Route>
        <Route path="/login">
          {console.log("Login Route, token status:", token)}
          {token ? <Redirect to="/dashboard" /> : <LoginPageWithLocation />}
        </Route>
        <ProtectedRoute path="/dashboard" component={BusinessDashboard} />
        <Route path="/order/:uniqueLink" component={OrderSubmissionPage} />
      </Switch>
    </Router>
  );
}

const LoginPageWithLocation = () => {
  const location = useLocation();
  return <LoginPage key={location.pathname + location.search} />;
}

export default App;
