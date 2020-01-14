import React, { useState } from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import About from "./pages/About"
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Forgotpassword from './pages/Forgotpassword';
import Verification from './pages/Verification';
import Tasks from "./pages/Tasks";
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard'
import Users from "./pages/Users";
import TodoChatbot from "./components/TodoChatbot";
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
              <Route path="/verification" component={Verification} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/forgotpassword" component={Forgotpassword} />
              <Route path="/about" component={About} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/tasks" component={Tasks} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/users" component={Users} />
            </Switch>
          </div>
          <div>
            <div className="chatbotstyle container mt-5">
              <TodoChatbot/>
            </div>
          </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
