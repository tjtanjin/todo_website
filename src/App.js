import React, { useState } from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Tasks from "./pages/Tasks";
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard'
import Users from "./pages/Users";
import { AuthContext } from "./context/auth";

function App(props) {

  const [authTokens, setAuthTokens] = useState();
  
  const setTokens = (data) => {
    localStorage.setItem("todo_data", JSON.stringify(data));
    setAuthTokens(data);
  }  

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
          <div className="wrapper">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/tasks" component={Tasks} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/users" component={Users} />
            </Switch>
          </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
