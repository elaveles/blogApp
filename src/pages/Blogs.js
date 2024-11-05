import { useEffect, useState, useContext } from 'react';
import PostCard from '../components/PostCard';
import UserContext from '../UserContext';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Blog() {
    const { user } = useContext(UserContext); 
    const [posts, setPosts] = useState([]);

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/posts/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data.posts)) {
                setPosts(data.posts);
            } else {
                setPosts([]);
            }
        })
        .catch(err => console.error('Error fetching posts:', err));
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {user ? (
                posts.length > 0 ? (
                    <>  
                        <h1 className='text-center mt-5'>Blog Posts</h1>
                        <Row> 
                            {posts.map(post => ( 
                                <Col md={3} key={post._id}>
                                    <PostCard post={post} />
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <h1>No Blog Posts</h1>
                )
            ) : (
                <>
                    <h1>You are not logged in</h1>
                    <Link className="btn btn-primary" to="/login">Login to View</Link>
                </>
            )}
        </>
    );
}
