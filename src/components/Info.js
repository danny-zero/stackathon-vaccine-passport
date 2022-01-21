import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Image, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton, Nav, Navbar, NavDropdown, FormControl } from 'react-bootstrap';
import styles from './css/info.module.css';

const Info = ({ auth, setAuth }) => {

    //console.log('vaccine info page', auth)
    const [vaccine, setVaccine] = useState('');
    const [firstDose, setFirstDose] = useState('');
    const [secondDose, setSecondDose] = useState('');
    const [booster, setBooster] = useState('');
    const [showCard, setShowCard] = useState(false)

    const [file, setFile] = useState();
    const [imagePath, setImagePath] = useState();
    const [profilePhoto, setProfilePhoto] = useState();

    const postImage = async ({ image }) => {
        const formData = new FormData();
        formData.append('image', image);

        const result = await axios.post(`/api/images/${auth.user.id}`, formData, { headers: {'Content-Type': 'multipart/form-data'}})
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

    const createVaccine = async (vaxInfo) => {
        //console.log('vaxInfo', vaxInfo);
        const { data: vaccine } = await axios.post(`/api/auth/createVaccine/${auth.user.id}`, vaxInfo)
        //console.log('was the vaccine created?', vaccine)
        //console.log('did the vaccine get created and added to user?', auth)
        auth.user.vaccine = vaccine
        setAuth({...auth, ...auth.user.vaccine})
    }

    const submitForm = async (e) => {
        e.preventDefault();
        //console.log('vaccine:', vaccine)
        //console.log('first dose:', firstDose)
        if (mRNA.includes(vaccine)) {
            //console.log('second dose:', secondDose)
        }
        await createVaccine({id: auth.user.id, vaccine, firstDose, secondDose, booster})
        await postImage({image: file});
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
            {
                auth.user.vaccine ? (
                    <div className={styles.userProfileInfo}>
                    <h2>Vaccine Info:</h2>
                    {
                        auth.user.profilePhoto ? (
                            <img className={styles.profilePhoto} src={auth.user.profilePhoto}/>
                        ) : (
                            <div className={styles.uploadPhoto}>
                                <img className={styles.placeholderPhoto} src='public/blank_avatar.png'/>
                                <form onSubmit={submitProfilePhoto}>
                                    <label htmlFor="profilePhoto">Add Profile Photo</label>
                                    <br />
                                    <input type="file" id="profilePhoto" onChange={(e) => setProfilePhoto(e.target.files[0])}/>
                                    <button type="submit">Upload</button>
                                </form>
                            </div>
                        )
                    }
                    <Nav.Link href="#/edit-info">Edit Info</Nav.Link>
                    <h3>Name: {auth.user.firstName} {auth.user.lastName}</h3>
                    <h3>Manufacturer: {auth.user.vaccine.name}</h3>
                    <h3>First Dose: {auth.user.vaccine.firstDose}</h3>
                    {
                        auth.user.vaccine.secondDose ? (<h3>Second Dose: {auth.user.vaccine.secondDose}</h3>) : null
                    }
                    {
                        auth.user.vaccine.booster ? (<h3>Booster: {auth.user.vaccine.booster}</h3>) : null
                    }
                    <Button className={styles.btnSignUp} onClick={() => setShowCard(!showCard)}>View Card</Button>

                            <Modal show={showCard} size='lg' onHide={() => setShowCard(!showCard)}>
                                <Modal.Header closeButton></Modal.Header>
                                <Modal.Body>
                                    <Image src={auth.user.vaccine.cdcCard ? auth.user.vaccine.cdcCard : imagePath} fluid />
                                </Modal.Body>
                            </Modal>
                    </div>
                ) 
                : ( 
                    <div>
                    <Container>
                        <Form onSubmit={submitForm}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Which Vaccine did you take?</Form.Label>
                                <Form.Control required as="select" onChange={(e) => setVaccine(e.target.value)}>
                                    <option value="">Select a Vaccine</option>
                                    <option value="Pfizer">Pfizer</option>
                                    <option value="Moderna">Moderna</option>
                                    <option value="J&J">Johnson & Johnson</option>
                                </Form.Control>
                            </Form.Group>
                            {
                                mRNA.includes(vaccine) ? 
                                (
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of First Dose</Form.Label>
                                        <Form.Control required type="date" placeholder="mm/dd/yyyy" onChange={(e) => setFirstDose(e.target.value)}/>
                                        <Form.Label>Date of Second Dose</Form.Label>
                                        <Form.Control type="date" placeholder="mm/dd/yyyy" onChange={(e) => setSecondDose(e.target.value)}/>
                                        <Form.Label>Date of Booster</Form.Label>
                                        <Form.Control type="date" placeholder="mm/dd/yyyy" onChange={(e) => setBooster(e.target.value)}/>
                                    </Form.Group>
                                ) : vaccine === 'J&J' ? 
                                (
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of Dose</Form.Label>
                                        <Form.Control required type="date" placeholder="mm/dd/yyyy" onChange={(e) => setFirstDose(e.target.value)}/>
                                        <Form.Label>Date of Booster</Form.Label>
                                        <Form.Control type="date" placeholder="mm/dd/yyyy" onChange={(e) => setBooster(e.target.value)}/>
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
                ) 
            }
        </div>
    )
}

export default Info
