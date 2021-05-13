import React from 'react';
import { Link, HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Modal, Container, Row, Col, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton, Nav, Navbar, NavDropdown, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './css/navbar.module.css';

const NavBar = ({ logout, auth }) => {
    return (
        <Nav className={styles.justifyContentEnd}>
            <Navbar bg="light" expand="lg" >
                <Navbar.Brand href="/"><img className={styles.logo} src='public/logo_reversed.png' /></Navbar.Brand>
                <Navbar.Brand href="/">Vaccine Passport</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    { auth.user ? (
                        <NavDropdown title='Account Info' id="basic-nav-dropdown">
                        <NavDropdown.Item href="#/info">Vaccine Info</NavDropdown.Item>
                        <NavDropdown.Item href="/">QR Code</NavDropdown.Item>
                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    ) : (
                        <Nav.Link href="#/signup">Login/Sign Up</Nav.Link>
                    )}
                    
                    <Nav.Link href="#/tracker">COVID-19 Stats</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Nav>
    )
}

export default NavBar