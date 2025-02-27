import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import AddPosts from './pages/AddPost';

import './App.css';
import {UserProvider} from './UserContext';

function App() {

    const [user, setUser] = useState({
      id: null
    });

    const unsetUser = () => {

      localStorage.clear();

    };
  
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if(localStorage.getItem("token") !== null) {
    fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    .then(res => res.json())
    .then(data => {
      setUser({
        id: data._id,
        isAdmin: data.isAdmin
      });
      setIsLoading(false);
    });
  } else {
    setUser({
      id: null,
      isAdmin: null
    });  
    setIsLoading(false);
  }
}, []);

if (isLoading) {
  return <div>Loading...</div>;
}

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/add" element={<AddPosts />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;