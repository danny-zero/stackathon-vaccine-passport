import React from 'react';
import QRCode from 'qrcode.react';
import { Modal, Container, Row, Col, Image, Button, Alert, Breadcrumb, Card, Form, Dropdown, DropdownButton, Nav, Navbar, NavDropdown, FormControl } from 'react-bootstrap';
import styles from './css/qr.module.css';

// DO NOT USE NATIVE IOS QR SCANNER, IT DOESN'T WORK FOR SOME REASON, USE ONE DOWNLOADED FROM APP STORE

const QR = ({auth}) => {
    console.log('QR auth', auth);

    const withinAYear = (firstDose) => {
        //https://replit.com/@zenturtle/older-than-one-year#index.js
        firstDose = new Date(firstDose)
    
        const today = new Date();

        const firstDosePlusTwelveMonths = new Date(firstDose.setMonth(firstDose.getMonth() + 12))

        return firstDosePlusTwelveMonths > today
    }

    const dataCompiler = (pat, vax) => {
        //Patient Name
        let fullName = 'Name: '
        let result = '';
        let capitalized;
        for (let key in pat) {
            if (key === 'firstName' || key === 'lastName') {
                    const letter = pat[key][0].toUpperCase()
                    capitalized = pat[key]
                    capitalized = capitalized.split('')
                    capitalized.splice(0, 1, letter)
                    capitalized = capitalized.join('')
            }
            if (key === 'firstName') {
                fullName += `${capitalized}`
            } else if (key === 'lastName') {
                fullName += ` ${capitalized}`
            }
        }

        result += fullName
        result += '\nVaccine Info:'

        //Vaccine Information
        for (let key in vax) {
            if (vax[key]) {
                if (key === 'name') {
                    result += `\nManufacturer: ${vax[key]}`
                } else if (key === 'firstDose') {
                    result += `\nFirst Dose: ${vax[key]}`
                }  else if (key === 'secondDose') {
                    result += `\nSecond Dose: ${vax[key]}`
                } else if (key === 'booster') {
                    result += `\nBooster: ${vax[key]}`
                } else if (key === 'cdcCard') {
                    result += `\nCDC Card: https://stackathon-vaccine-passport.herokuapp.com${vax[key]}`
                    //result += `\nCDC Card: https://static.wikia.nocookie.net/marvel_dc/images/4/4b/Batman_Vol_3_86_Textless.jpg/revision/latest?cb=20200502132734}`
                }
            }
        }
        return result
    }


    //console.log('function test', dataCompiler(auth.user, auth.user.vaccine))

    return (
        <div className={styles.container}>
                {
                    withinAYear(auth.user.vaccine.firstDose) ? (
                        <div className={styles.qrContainer}>
                            <div className={styles.header}>
                                <h2>Vaccinated</h2>
                            </div>
                            <QRCode 
                                id='vaccine-code'
                                size={200}
                                value={dataCompiler(auth.user, auth.user.vaccine)}
                            />
                            <img className={styles.check} src='public/success-green-check-mark.png' />
                        </div>
                    ) : (
                        <div className={styles.qrContainer}>
                            <div className={styles.headerRed}>
                                <h2>Due for Vaccine</h2>
                            </div>
                            <QRCode 
                                id='vaccine-code'
                                fgColor='#f60100'
                                size={200}
                                value={`${auth.user.firstName} ${auth.user.lastName}'s first vaccine dose was more than 12 months ago`}
                            />
                            <img className={styles.check} src='public/red-x.png' />
                        </div>
                    )
                }
        </div>
    )
}

export default QR
