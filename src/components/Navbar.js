import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <BootstrapNavbar 
      bg="primary" 
      variant="dark" 
      expand="lg"
      className="navbar-veterinaria shadow-lg"
    >
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand-veterinaria">
          <span className="logo-icon">🐾</span>
          <span className="brand-text">Clínica Veterinaria</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="navbar-toggle-custom"
        />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav" className="navbar-collapse-custom">
          <Nav className="me-auto navbar-nav-custom">
            <Nav.Link 
              as={Link} 
              to="/mascotas" 
              className="nav-link-custom"
            >
              <span className="nav-icon">🐕</span>
              Mascotas
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/mascotas/new" 
              className="nav-link-custom"
            >
              <span className="nav-icon">➕</span>
              Registrar Mascota
            </Nav.Link>
          </Nav>
          
          <Nav className="ms-auto">
            <Nav.Link href="#" className="nav-link-custom">
              <span className="nav-icon">📞</span>
              Contacto
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;