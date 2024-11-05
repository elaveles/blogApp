import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="shadow-sm py-3"
    >
      <Container fluid="md">
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold fs-4 text-primary"
        >
          <i className="bi bi-journal-text me-2"></i>
          NoteNest
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              end 
              className="px-3"
            >
              Home
            </Nav.Link>

            {user.id !== null ? (
              <>
                <Nav.Link 
                  as={NavLink} 
                  to="/posts" 
                  className="px-3"
                >
                  Blog Posts
                </Nav.Link>

                <Nav.Link 
                  as={NavLink} 
                  to="/add" 
                  className="px-3"
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Add Post
                </Nav.Link>

                <Button 
                  as={NavLink} 
                  to="/logout"
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={NavLink}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="px-4"
                >
                  Login
                </Button>

                <Button
                  as={NavLink}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="px-4"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}