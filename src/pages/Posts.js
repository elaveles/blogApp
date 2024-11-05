import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import UserContext from '../UserContext';

export default function Blog() {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = () => {
        setLoading(true);
        setError(null);
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
        .catch(err => {
            console.error('Error fetching posts:', err);
            setError('Failed to load blog posts. Please try again later.');
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Container className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">Loading posts...</p>
                </div>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <i className="bi bi-lock-fill text-primary display-1 mb-4"></i>
                    <h2 className="mb-4">Login Required</h2>
                    <p className="text-muted mb-4">
                        Please log in to view blog posts
                    </p>
                    <Button 
                        as={Link} 
                        to="/login" 
                        variant="primary" 
                        size="lg"
                        className="px-5"
                    >
                        Login to View
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="mb-5">
                <Col className="text-center">
                    <h1 className="display-4 fw-bold mb-4">Blog Posts</h1>
                    <Button 
                        as={Link} 
                        to="/add" 
                        variant="outline-primary" 
                        className="mb-5"
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Create New Post
                    </Button>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {posts.length > 0 ? (
                <Row className="g-4">
                    {posts.map(post => (
                        <Col xs={12} sm={6} lg={4} xl={3} key={post._id} className="d-flex align-items-stretch">
                            <PostCard post={post} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-journal-x text-muted display-1 mb-4"></i>
                    <h3 className="text-muted">No Posts Found</h3>
                    <p className="text-muted mb-4">
                        Be the first to create a blog post!
                    </p>
                    <Button 
                        as={Link} 
                        to="/add" 
                        variant="primary"
                    >
                        Create Your First Post
                    </Button>
                </div>
            )}
        </Container>
    );
}