import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, InputGroup, Row, Col } from 'react-bootstrap';
import styles from './css/loginSignUp.module.css';

const SignIn = ({ incorrect, signIn, signUp, setSignUp, passwordType, setPasswordType }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (ev) => {
        ev.preventDefault();
        //console.log("submitted")
        signIn({
            email,
            password
        })
    }

    return (
        <div className={styles.container}>
            {/* <h1>Log In</h1> */}
            {
                incorrect ? (<p className={styles.incorrectAlert}>Incorrect username/password</p>) : null
            }
             <Container>
             <Row>
             <Col className={styles.col1}>
             <img className="animate__animated animate__rotateIn"src="public/logo_reversed.png" />
             </Col>
             <Col className={styles.col2}>
                <h1>Log In</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Email: </Form.Label>
                        <Form.Control type="text" placeholder="user@info.com" onChange={(e) => setEmail(e.target.value)}/>
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
                            <Form.Control type={passwordType} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                        </InputGroup>
                    </Form.Group>
                    <Button className={styles.btnSignUp} type="submit" variant="dark">Sign In</Button>
                    <p onClick={() => setSignUp(true)}>Don't Have an account? <span className={styles.loginSignUp}>Sign Up Here</span></p>
                </Form>
                </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignIn
