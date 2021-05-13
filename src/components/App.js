import axios from 'axios';
import React, { Component } from 'react';
import { Redirect, Link, HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Modal, Container, Row, Col, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import Splash from './Splash';
import Info from './Info';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Tracker from './COVID-Tracker/Tracker'

        class App extends Component {
            constructor() {
                super();
                this.state = {
                    auth: {},
                    signUp: true
                };
                this.signIn = this.signIn.bind(this);
                this.logout = this.logout.bind(this);
                this.createUser = this.createUser.bind(this);
            }
            logout() {
                window.localStorage.removeItem('token');
                this.setState({ auth: {} });
            }


            async attemptTokenLogin() {
                const token = window.localStorage.getItem('token');
                //console.log("attemptTokenLogin, token = ", token)
                if (token) {
                    const response = await axios.get('/api/auth', {
                        headers: {
                            authorization: token
                        }
                    });
                    //console.log("hello", response.data)
                    if (response.data) {
                        this.setState({ auth: response.data });
                    } else {
                        alert(response.data)
                    }
                    
                }
            }


            componentDidMount() {
                this.attemptTokenLogin();
            }

            async createUser(credentials) {
                //console.log(credentials) 
                //console.log("made it to post?", req.body) //is there a way to secure the password here? it doesn't seem secure to send it in plain text to the server to be create
                const { data: { token } } = await axios.post('/api/auth/createUser', credentials);
                //console.log("did we get the token?", token)
                window.localStorage.setItem('token', token);
                this.attemptTokenLogin();
            }

            async signIn(credentials) {
                //console.log("singIn credentials", credentials)
                const response = await axios.post('/api/auth', credentials);
                const { token } = response.data;
                window.localStorage.setItem('token', token);
                this.attemptTokenLogin();
            }

            render() {
                //console.log(this.state)
                const { auth, signUp } = this.state;
                const { signIn, logout, createUser } = this;
                return (
                    <Router>
                        <NavBar auth={auth}/>
                        <Switch>
                            <Route exact path="/">
                                {/* just testing if ternary is working */}
                                {
                                    auth.user ? (<Splash auth={auth} logout={logout}/>)
                                    : signUp ? (<SignUp createUser={createUser}/>) 
                                    : !signUp ? (<SignIn signIn={signIn}/>)
                                    : null}
                                <p>already have an account? <span onClick={() => this.setState({signUp: false})}>Login</span></p>
                            </Route>
                            <Route path="/info"><Info /></Route>
                            <Route path="/tracker"><Tracker /></Route>
                        </Switch>
                    </Router>
                )
            }
        }

export default App
