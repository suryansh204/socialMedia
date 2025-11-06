import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './utils/AuthRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';

export const ThemeContext = createContext(null);

function App() {

  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(prevValue => prevValue === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div id={theme}>
        <AuthProvider>
          <Router>
            <Container>
              <MenuBar onChange={toggleTheme} checked={theme === 'dark' ? true : false}/>
              <Routes>
                <Route exact path="/" element={<Home />} />

{/* Use AuthRoute as the element that wraps the Login/Register components */}
<Route 
    exact 
    path="/login" 
    element={<AuthRoute element={<Login />} />} 
/>
<Route 
    exact 
    path="/register" 
    element={<AuthRoute element={<Register />} />} 
/>

<Route exact path="/posts/:postId" element={<SinglePost />} />
<Route exact path="/profiles/:username" element={<Profile />} />
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<AuthRoute />}>
                  <Route exact path="/login" element={<Login />} />
                </Route>
                <Route exact path="/register" element={<AuthRoute />}>
                  <Route exact path="/register" element={<Register />} />
                </Route>
                <Route exact path="/posts/:postId" element={<SinglePost />} />
                <Route exact path="/profiles/:username" element={<Profile />} />
              </Routes>
            </Container>
          </Router>
        </AuthProvider>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;