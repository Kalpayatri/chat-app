import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Register from "./pages/register";
import ChatApp from '../src/component/ChatApp'

const App=()=>{
  return(
   <Router>
    <Route exact path="/" component={Home}></Route>
    <Route exact path="/login" component={Login}></Route>
    <Route exact path="/register" component={Register}></Route>
    <Route exact path="/chatapp" component={ChatApp}></Route>
   </Router>
  )
}
export default App