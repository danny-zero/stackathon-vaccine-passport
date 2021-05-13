import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import styles from '../Chart/Chart.module.css';

const Chart = ({ data: {confirmed, recovered, deaths, flag}, country, confArr }) => {
    // console.log("country ? ", country)
    console.log('country confirmed', country, confirmed)
    const [dailyData, setDailyData] = useState([])

    // useEffect(() => {
    //     const fetchDailyData = async () => {
    //         let { data } = await axios.get('/api/tracker/daily');
    //         data = data.filter(elem => new Date(elem.date) > new Date('03-11-21'))
    //         setDailyData(data)
    //     }
    //     fetchDailyData();
    // }, []);

    useEffect(() => {
        const fetchDailyData = async () => {
            if (country === 'global' || !country) {
                let { data } = await axios.get('/api/tracker/daily');
                data = data.filter(elem => new Date(elem.date) > new Date('03-11-21'))
                setDailyData(data)
            } else {
                let { data } = await axios.get(`/api/tracker/country/${country}`);
                data = data.filter(elem => new Date(elem.date) > new Date('03-11-21'))
                setDailyData(data)
            }
        }
        fetchDailyData();
    }, [])

    // console.log('DAILY DATA??????????', dailyData)

    const lineChart = (
        dailyData.length !== 0 
            ? (
                <Line 
                data={{
                    labels: dailyData.sort((a, b) => new Date(a.date) - new Date(b.date)).map(({date}) => date),
                    datasets: [
                        {
                            data: dailyData.map(({ confirmed }) => confirmed),
                            label: 'Infected',
                            borderColor: '#4b90e2',
                            backgroundColor: 'rgba(5, 83, 177, 0.5)',
                            fill: true,
                        },
                        {
                            data: dailyData.map(({ deaths }) => deaths),
                            label: 'Deaths',
                            borderColor: 'black',
                            backgroundColor: 'rgba(99, 99, 99, 0.5)',
                            fill: true,
                        }
                    ]
                }} 
            /> 
            )
            : null
    );

    const barChart = (
        confirmed  
            ? (
                <Bar 
                    data={{
                        labels: ['Infected', 'Recovered', 'Deaths'],
                        datasets: [{
                            label: 'People',
                            backgroundColor: ['rgba(5, 83, 177, 0.5)', 'rgba(89, 250, 89, 0.543)', 'rgba(99, 99, 99, 0.5)'],
                            data: [confirmed, recovered, deaths]
                        }],
                    }}
                    options={{
                        legend: {display: false},
                        title: {display: true, text: `COVID-19 Stats in ${country}`}
                    }}
                />
            ) : null
    )

    // const barChart = (
    //     confirmed  
    //         ? (
    //             <Line 
    //                 data={{
    //                     labels: dailyData.sort((a, b) => new Date(a.date) - new Date(b.date)).map(({date}) => date),
    //                     datasets: [{
    //                         label: 'People',
    //                         backgroundColor: ['rgba(5, 83, 177, 0.5)', 'rgba(89, 250, 89, 0.543)', 'rgba(99, 99, 99, 0.5)'],
    //                         data: [confirmed, recovered, deaths]
    //                     }],
    //                 }}
    //                 options={{
    //                     legend: {display: false},
    //                     title: {display: true, text: `COVID-19 Stats in ${country}`}
    //                 }}
    //             />
    //         ) : null
    // )


    

    
    return (
        <div className={styles.container}>
            {country ? barChart : lineChart}
            {/* {country ? countryLineChart : lineChart} */}
        </div>
    )
}

export default Chart
