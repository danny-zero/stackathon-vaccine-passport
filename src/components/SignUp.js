import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, InputGroup, Row, Col } from 'react-bootstrap';
import styles from './css/loginSignUp.module.css';

const SignUp = ({ createUser, signUp, setSignUp, passwordType, setPasswordType }) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (ev) => {
        ev.preventDefault();
        //console.log("submitted")
        createUser({
            firstName,
            lastName,
            email,
            password
        })
    }

    return (
        <div className={styles.container}>
            {/* <h1>Sign Up</h1> */}
             <Container>
             <Row>
             <Col className={styles.col1}>
             <img className="animate__animated animate__rotateIn"src="public/logo_reversed.png" />
             <h1>Sign Up</h1>
             </Col>
             <Col className={styles.col2}>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>First Name: </Form.Label>
                        <Form.Control required type="text" onChange={(e) => setFirstName(e.target.value)}/>
                        <Form.Label>Last Name: </Form.Label>
                        <Form.Control required type="text"  onChange={(e) => setLastName(e.target.value)}/>
                        <Form.Label>Email: </Form.Label>
                        <Form.Control required type="text" placeholder="user@info.com" onChange={(e) => setEmail(e.target.value)}/>
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    {
                                        passwordType === 'password' ? (<i onClick={() => setPasswordType('text')} className="fa fa-eye" aria-hidden="true"></i>)
                                        : passwordType === 'text' ? (<i onClick={() => setPasswordType('password')} className="fa fa-eye-slash" aria-hidden="true"></i>)
                                        : null
                                    }
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control required type={passwordType} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                        </InputGroup>
                    </Form.Group>
                    <Button className={styles.btnSignUp} type="submit" variant="dark">Sign Up</Button>
                    <p onClick={() => setSignUp(false)}>Already have an account? <span className={styles.loginSignUp}>Login Here</span></p>
                </Form>
                </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignUp
