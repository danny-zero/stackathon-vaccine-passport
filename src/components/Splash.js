import React from 'react';
import { Modal, Container, Row, Col, Image, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton, Nav, Navbar, NavDropdown, FormControl } from 'react-bootstrap';
import styles from './css/loginSignUp.module.css';

const Splash = ({ size }) => {
    console.log('size', size)
    return (
        <Container className="splash-container">
            {
                size <= 600 ? (
                    <>
                    <img className="animate__animated animate__rotateIn"src="public/logo_reversed.png" />
                    <Button className={styles.btnSignUp} href="/#signup">Sign Up / Login</Button>
                    </>
                ) : (
                    <>
                        <h1>You are not a mobile device</h1>
                    </>
                )
            }
        </Container>
    )
}

export default Splash
