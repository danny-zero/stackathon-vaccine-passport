import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import styles from '../Cards/Cards.module.css';
import CountUp from 'react-countup';
import cx from 'classnames'; //A javaScript utility for conditionally joining classNames together


const Cards = ({ data: { confirmed, recovered, deaths, lastUpdate  } }) => {
    if(!confirmed) return 'Loading...'
    // console.log("confirmed", confirmed)
    return (
        <div className={styles.container}>
            <Grid container spacing={3} justify="center">
                <Grid item component={Card} xs={12} md={3} className={cx(styles.card, styles.infected)}>
                    <CardContent className={styles.cardInd}>
                        <Typography color="textSecondary" gutterBottom>Infected</Typography>
                        <Typography variant="h5">
                            <CountUp start={0} end={confirmed} duration={2.5} separator={","} />
                        </Typography>
                        <Typography color="textSecondary">As of: {new Date(lastUpdate).toDateString()}</Typography>
                        <Typography variant="body2">Number of active cases of COVID-19</Typography>
                    </CardContent>
                </Grid>
                <Grid item component={Card} xs={12} md={3} className={cx(styles.card, styles.recovered)}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>Recovered</Typography>
                        <Typography variant="h5">
                            <CountUp start={0} end={recovered} duration={2.5} separator={","} />
                        </Typography>
                        <Typography color="textSecondary">As of: {new Date(lastUpdate).toDateString()}</Typography>
                        <Typography variant="body2">Number of recoveries from COVID-19</Typography>
                    </CardContent>
                </Grid>
                <Grid item component={Card} xs={12} md={3} className={cx(styles.card, styles.deaths)}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>Deaths</Typography>
                        <Typography variant="h5">
                            <CountUp start={0} end={deaths} duration={2.5} separator={","} />
                        </Typography>
                        <Typography color="textSecondary">As of: {new Date(lastUpdate).toDateString()}</Typography>
                        <Typography variant="body2">Number of deaths from COVID-19</Typography>
                    </CardContent>
                </Grid>
            </Grid>
        </div>
    )
}

export default Cards
