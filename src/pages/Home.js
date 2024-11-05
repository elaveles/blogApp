import { useContext } from 'react';
import { Container, Row, Col, Button, Card, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <Container fluid className="min-vh-100">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} md={8} lg={6}>
                    <Card className="border-0 shadow-lg">
                        <Card.Body className="text-center p-5">
                            
                            <Card.Title as="h1" className="display-4 fw-bold mb-3">
                                Welcome to NoteNest
                            </Card.Title>
                            
                            <Card.Text className="lead text-muted mb-4">
                                Your Ideas, All in One Nest
                            </Card.Text>

                            <Stack 
                                direction="vertical" 
                                gap={3} 
                                className="mx-auto" 
                                style={{ maxWidth: '300px' }}
                            >
                                <Button 
                                    as={Link} 
                                    to="/posts" 
                                    variant="primary" 
                                    size="lg" 
                                    className="w-100"
                                >
                                    Check All Posts
                                </Button>

                                {user.id !== null ? (
                                    <Button 
                                        as={Link} 
                                        to="/add" 
                                        variant="outline-primary" 
                                        size="lg" 
                                        className="w-100"
                                    >
                                        Create a New Post
                                    </Button>
                                ) : (
                                    <Button 
                                        as={Link} 
                                        to="/register" 
                                        variant="outline-primary" 
                                        size="lg" 
                                        className="w-100"
                                    >
                                        Join Now
                                    </Button>
                                )}
                            </Stack>

                            {!user.id && (
                                <Card.Text className="text-muted mt-4">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-decoration-none">
                                        Sign in
                                    </Link>
                                </Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}