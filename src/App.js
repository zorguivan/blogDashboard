import Home from './components/Home';
import Login from './components/Login';
import Blogs from './components/Blogs';
import React, {useState, useContext, useEffect} from 'react';
import './styling/style.css'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { AuthProvider } from './context/AuthState';
import { BlogProvider } from './context/BlogState';


function App() {
  return (
        <AuthProvider>
            <BlogProvider>
                <Router>
                    <Switch>
                        <Route path='/login' component={Login} />
                        <Route exact path="/" component={Home} />
                        <Route exact path="/blogs" component={Blogs} />
                        <Route exact path="/blog/:blogId" component={Home} />
                    </Switch>
                </Router> 
            </BlogProvider>
        </AuthProvider>
        
  );
}

export default App;
