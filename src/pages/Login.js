import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const authenticate = async (e) => {
        e.preventDefault();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.access);
            retrieveUserDetails(data.access);
            Swal.fire({ title: "Login Successful", icon: "success", text: "Welcome!" });
        } else {
            Swal.fire({ title: "Error", icon: "error", text: data.message || "Check your login details and try again." });
        }

        setUsername('');
        setEmail('');
        setPassword('');
    };

    const retrieveUserDetails = async (token) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (data.user) {
            setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        }
    };

    useEffect(() => {
        setIsActive((username !== '' || email !== '') && password !== '');
    }, [username, email, password]);

    return (
        user.id !== null ? (
            <Navigate to="/posts" />
        ) : (
            <Form onSubmit={authenticate}>
                <h1 className="my-5 text-center">Login</h1>
                <Form.Group controlId="userUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={!isActive}>
                    Submit
                </Button>
            </Form>
        )
    );
}
