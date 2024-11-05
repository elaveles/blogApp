import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {
    const { user } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    const registerUser = async (e) => {
        e.preventDefault();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            Swal.fire({
                title: "Registration Successful",
                icon: "success",
                text: "Thank you for registering!"
            });
        } else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: data.message || "Please try again later."
            });
        }
    };

    useEffect(() => {
        setIsActive(username !== "" && email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword);
    }, [username, email, password, confirmPassword]);

    return (
        user.id !== null ? (
            <Navigate to="/posts" />
        ) : (
            <Form onSubmit={registerUser}>
                <h1 className="my-5 text-center">Register</h1>
                <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter Username" 
                        required 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control 
                        type="email"
                        placeholder="Enter Email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Confirm Password" 
                        required 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={!isActive}>
                    Submit
                </Button>
            </Form>
        )
    );
}
