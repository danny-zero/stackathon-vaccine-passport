import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect, Link, HashRouter as Router, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Modal, Container, Row, Col, Image, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton, Nav, Navbar, NavDropdown, FormControl } from 'react-bootstrap';
import styles from './css/info.module.css';

const Info = ({ auth, setAuth }) => {

    //console.log('vaccine info page', auth)
    const history = useHistory();
    const [vaccine, setVaccine] = useState(() => auth.user.vaccine.name);
    const [firstDose, setFirstDose] = useState(() => auth.user.vaccine.firstDose);
    const [secondDose, setSecondDose] = useState(() => auth.user.vaccine.secondDose);
    const [booster, setBooster] = useState(() => auth.user.vaccine.booster);
    const [showCard, setShowCard] = useState(false)

    const [file, setFile] = useState();
    const [imagePath, setImagePath] = useState();
    const [profilePhoto, setProfilePhoto] = useState();

    console.log('first dose', firstDose);
    console.log('booster', booster);

    const postImage = async ({ image }) => {
        const formData = new FormData();
        formData.append('image', image);

        const result = await axios.put(`/api/images/${auth.user.id}`, formData, { headers: {'Content-Type': 'multipart/form-data'}})
        //console.log('result.data', result.data.imagePath)
        setImagePath(result.data.imagePath)
        return result.data;
        // auth.user = {...auth.user, ...result}
        // setAuth({...auth, ...auth.user})
    }

    const fileSelected = (e) => {
        const file = e.target.files[0]
        //console.log('file', file)
        setFile(file)
    }

    const mRNA = ['Pfizer', 'Moderna']

    const editVaccine = async (vaxInfo) => {
        //console.log('vaxInfo', vaxInfo);
        const { data: vaccine } = await axios.put(`/api/auth/editVaccine/${auth.user.vaccine.userId}`, vaxInfo)
        //console.log('was the vaccine created?', vaccine)
        //console.log('did the vaccine get created and added to user?', auth)
        auth.user.vaccine = vaccine
        setAuth({...auth, ...auth.user.vaccine})
    }

    const submitForm = async (e) => {
        e.preventDefault();
        console.log('vaccine:', vaccine)
        console.log('first dose inside submit:', firstDose)
        console.log('second dose inside submit:', secondDose)
        console.log('booster inside submit:', booster)
        await editVaccine({id: auth.user.id, vaccine, firstDose, secondDose, booster})
        await postImage({image: file});
        history.push('/info');
    }

    const submitProfilePhoto = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', profilePhoto);
        //console.log(profilePhoto)
        const result = (await axios.post(`/api/images/profile-photo/${auth.user.id}`, formData, { headers: {'Content-Type': 'multipart/form-data'}})).data;
        //console.log('result', result)
        auth.user = {...auth.user, ...result}
        setAuth({...auth, ...auth.user})
        //console.log('newAuth', auth)
    }

    // useEffect(() => {
    //     console.log('useEffect ran')
    // }, [auth])

    return (
        <div className={styles.userProfile}> 
                    <div>
                    <Container>
                        <Form onSubmit={submitForm}>
                            {
                                mRNA.includes(auth.user.vaccine.name) ? 
                                (
                                    //placeholder={auth.user.vaccine.firstDoe ? auth.user.vaccine.firstDose : "mm/dd/yyyy"}
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of First Dose</Form.Label>
                                        <Form.Control required type="date" defaultValue={auth.user.vaccine.firstDose ? auth.user.vaccine.firstDose : ''} onChange={(e) => setFirstDose(e.target.value)}/>
                                        <Form.Label>Date of Second Dose</Form.Label>
                                        <Form.Control type="date" placeholder="mm/dd/yyyy" defaultValue={auth.user.vaccine.secondDose ? auth.user.vaccine.secondDose : ''} onChange={(e) => setSecondDose(e.target.value)}/>
                                        <Form.Label>Date of Booster</Form.Label>
                                        <Form.Control type="date" placeholder="mm/dd/yyyy" defaultValue={auth.user.vaccine.booster ? auth.user.vaccine.booster : ''} onChange={(e) => setBooster(e.target.value)}/>
                                    </Form.Group>
                                ) : auth.user.vaccine.name === 'J&J' ? 
                                (
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of Dose</Form.Label>
                                        <Form.Control required type="date" defaultValue={auth.user.vaccine.firstDose ? auth.user.vaccine.firstDose : ''} onChange={(e) => setFirstDose(e.target.value)}/>
                                        <Form.Label>Date of Booster</Form.Label>
                                        <Form.Control type="date" placeholder="mm/dd/yyyy" defaultValue={auth.user.vaccine.booster ? auth.user.vaccine.booster : ''} onChange={(e) => setBooster(e.target.value)}/>
                                    </Form.Group>
                                ) : (null)
                            }
                            <Form.Group>
                                <Form.File required label="Upload Proof of Vaccination" onChange={fileSelected}/>
                            </Form.Group>
                            <Button className={styles.btnSignUp} type="submit">Save</Button>
                        </Form>
                    </Container>
                    </div>
        </div>
    )
}

export default Info
