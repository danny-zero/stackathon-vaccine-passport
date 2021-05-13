import axios from 'axios';
import React, { Component } from 'react';
import { Link, HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Cards, Chart, CountryPicker } from '../COVID-Tracker';
import styles from './Tracker.module.css';

class Tracker extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            countryInfo: {},
            country: '',
            confArr: []
        }
        this.handleCountryChange = this.handleCountryChange.bind(this)
    }

    async componentDidMount() {
        const { data: fetchedData } = await axios.get('/api/tracker/all');
        this.setState({loading: false})
        this.setState({ countryInfo: fetchedData })
    }

    async handleCountryChange(country) {
        //console.log(country)
        
        if (country === 'global') {
            const { data: fetchedData } = await axios.get('/api/tracker/all');
            this.setState({loading: false})
            this.setState({ country: '', countryInfo: fetchedData })
        } else {
            const {data: countryInfo } = await axios.get(`/api/tracker/country/${country}`)
            //console.log('new stuff', countryInfo)
            this.setState({country, countryInfo})
        } 
    }

    render() {
        const { countryInfo, country, confArr } = this.state
        //console.log("APP STATE", this.state)

        // if (this.state.loading) return <h1>Loading...</h1>

        return (
            <div className={styles.container}>
                {countryInfo.flag ? (
                    <div className={styles.flag__and__country}>
                        <h3>{country}</h3>
                        <img className="flag" src={countryInfo.flag.value}/>
                    </div>
                ) : null}
                <Cards data={countryInfo}/>
                <CountryPicker handleCountryChange={this.handleCountryChange}/>
                <Chart confArr={confArr} data={countryInfo} country={country}/>
            </div>
        )
    }
}

export default Tracker

