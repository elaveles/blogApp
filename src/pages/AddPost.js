import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function AddPost() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function createPost(e) {
        e.preventDefault();

        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_URL}/posts/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Unsuccessful Post Creation",
                    text: data.message
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Post Added"
                });
                navigate("/posts");
            }
        })
        .catch(err => {
            console.error("Error creating post:", err);
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: "Please try again later."
            });
        });

        setTitle("");
        setContent("");
    }

    return (
        user.id ? (
            <>
                <h1 className="my-5 text-center">Add Post</h1>
                <Form onSubmit={createPost}>
                    <Form.Group>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Title" 
                            required 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Content:</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            placeholder="Enter Content" 
                            required 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="my-5">Submit</Button>
                </Form>
            </>
        ) : (
            <Navigate to="/login" /> 
        )
    );
}
