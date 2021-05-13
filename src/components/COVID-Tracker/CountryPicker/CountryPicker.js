import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NativeSelect, FormControl } from '@material-ui/core';
import styles from '../CountryPicker/CountryPicker.module.css';

const CountryPicker = ({ handleCountryChange }) => {
    const [fetchedCountries, setFetchedCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async() => {
            const {data} = await axios.get('/api/tracker/countries')
            // console.log('fetched countries ======', data)
            setFetchedCountries(data)
        }
        fetchCountries()
    }, [setFetchedCountries]);

    // console.log("countries state:", fetchedCountries)

    return (
        <div>
            <FormControl className={styles.formControl}>
                <NativeSelect defaultValue='' onChange={(e) => handleCountryChange(e.target.value)}>
                    <option value="global">Global</option>
                    {
                        fetchedCountries.map((country, index) => <option key={index} value={country.country}>{country.country}</option>)
                    }
                </NativeSelect>
            </FormControl>
        </div>
    )
}

export default CountryPicker
