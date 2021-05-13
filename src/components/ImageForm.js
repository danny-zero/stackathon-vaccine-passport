import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Modal, Container, Row, Col, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton, Nav, Navbar, NavDropdown, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageForm = () => {

    const [file, setFile] = useState();
    const [imagePath, setImagePath] = useState()

    console.log('imagePathState', imagePath)

    const postImage = async ({ image }) => {
        const formData = new FormData();
        formData.append('image', image);

        const result = await axios.post('/api/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
        console.log('result.data', result.data.imagePath)
        setImagePath(result.data.imagePath)
        return result.data;
    }

    const submitImage = async (e) => {
        e.preventDefault();
        const result = await postImage({image: file});
    };

    const fileSelected = (e) => {
        const file = e.target.files[0]
        console.log('file', file)
        setFile(file)
    }

    return (
        <div>
        <h1>Back End Image Upload via S3</h1>
            <Container>
                <Form onSubmit={submitImage}>
                    <Form.Group>
                        <Form.File label="Example file input" onChange={fileSelected}/>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </Container>

            <p>Air Nomads</p>
            <img src='/api/images/1d56be53143213abdad9b8f0f2b882b7' />
            <img src={imagePath} />
            
        </div>
    )
}

export default ImageForm
