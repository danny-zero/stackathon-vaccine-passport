import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Redirect, Link, HashRouter as Router, Route, Switch } from 'react-router-dom';

import NavBar from './NavBar';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Tracker from './COVID-Tracker/Tracker';
import Info from './Info';
import QR from './QR';
import Splash from './Splash';

function App() {

  const [auth, setAuth] = useState({})
  const [signUp, setSignUp] = useState(true)
  const [passwordType, setPasswordType] = useState('password')
  const [incorrect, setIncorrect] = useState(false)

  // for responsive elements
  const useWindowSize = () => {
      const [windowWidth, setWindowWidth] = useState(undefined)

      useEffect(() => {
          const handleResize = () => {
                setWindowWidth(window.innerWidth)
            }

          window.addEventListener('resize', handleResize)

          handleResize()

            return () => window.removeEventListener("resize", handleResize);
        }, [])

        return windowWidth
    }
  const size = useWindowSize();

  useEffect(() => {
    attemptTokenLogin()
    }, [])


    //user sign-up/Login
    const logout = () => {
      window.localStorage.removeItem('token');
      setAuth({})
      return <Redirect to="/" />
    }

    const attemptTokenLogin = async () => {
        const token = window.localStorage.getItem('token');
          //console.log("attemptTokenLogin, token = ", token)
          if (token) {
            const response = await axios.get('/api/auth', {
              headers: {
                authorization: token
              }
            });
          // console.log("AUTH?", response.data)
          setAuth(response.data);
          }
    }

    const createUser = async (credentials) => {
      //console.log("credentials", credentials)
      const { data: { token } } = await axios.post('/api/auth/createUser', credentials);
      //console.log("did we get the token?", token)
      window.localStorage.setItem('token', token);
      attemptTokenLogin();
    }

    const signIn = async (credentials) => {
      //console.log("singIn credentials", credentials)
      const response = await axios.post('/api/auth', credentials);
      const { token } = response.data;
      //console.log('did signin work?', token)
      if (token === 'ta errado') {
          setIncorrect(true)
          //alert('incorrect username/password')
      } else {
            window.localStorage.setItem('token', token);
            attemptTokenLogin();
      }
    }


    return (
        <Router>
            <NavBar 
              auth={auth}
              logout={logout}
              size={size} 
              />
            <Switch>
                  {/* <Route exact path="/">
                    {
                        !auth.user ? (<Splash />)
                        : !auth.user.vaccine ? (<Redirect to="/info" />)
                        : (<QR auth={auth}/>)
                    }
                  </Route> */}
                <Route exact path="/">
                {
                    !auth.user ? (<Redirect to="/signup" />)
                    : !auth.user.vaccine ? (<Redirect to="/info" />)
                    : (<QR auth={auth}/>)
                }
                </Route>
                <Route path="/user">
                {
                  !auth.user ? (<Redirect to="/signup" />)
                  : (<Info auth={auth} setAuth={setAuth} />)
                }
                </Route>
                <Route path="/signup">
                {
                  auth.user ? (<Redirect to="/" />) 
                  : signUp ? ( <SignUp passwordType={passwordType} setPasswordType={setPasswordType} createUser={createUser} signUp={signUp} setSignUp={setSignUp}/>)
                  : !signUp ? ( <SignIn incorrect={incorrect} passwordType={passwordType} setPasswordType={setPasswordType} signUp={signUp} signIn={signIn} setSignUp={setSignUp} /> )
                  : null
                }
                </Route>
                <Route path="/info">
                    {
                        !auth.user ? (<Redirect to="/" />)
                        : <Info auth={auth} setAuth={setAuth}/>
                    }
                </Route>
                <Route path="/tracker"><Tracker /></Route>
            </Switch>
        </Router>
    )
}

export default App
