import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome to NoteNest</h1>
                <p>Your Ideas, All in One Nest</p>
                <Link className="btn btn-primary" to="/posts">Check All Posts</Link>
                <div className="mt-3">
                    {user.id !== null ? (
                        <Link className="btn btn-secondary" to="/add">Create a New Post</Link>
                    ) : (
                        <Link className="btn btn-secondary" to="/register">Join Now</Link>
                    )}
                </div>
            </Col>
        </Row>
    );
}
