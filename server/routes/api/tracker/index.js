const router = require('express').Router();
const axios = require('axios');


const url = 'https://covid19.mathdro.id/api';

// router.get('/all', async (req, res, next) => {
//     try {
//         const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(url);
//         const modifiedData = {
//             confirmed,
//             recovered,
//             deaths,
//             lastUpdate
//         }
//         res.send(modifiedData)
//     } catch (error) {
//         console.error("DEU MERDA", error)
//         next(error)
//     }
// });

router.get('/all', async (req, res, next) => {
    try {
        const { data } = await axios.get('https://disease.sh/v3/covid-19/all');
        const modifiedData = {
            confirmed: data.cases,
            recovered: data.recovered,
            deaths: data.deaths,
            lastUpdate: data.updated
        }
        res.send(modifiedData)
    } catch (error) {
        console.error("DEU MERDA", error)
        next(error)
    }
});

// router.get('/daily', async (req, res, next) => {
//     try {
//         const { data } = await axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage`);
//         console.log('vacccine', data)
//         // console.log('newModifiedData', modifiedData)
//         res.send(data)
//     } catch (error) {
//         console.error('DEU MERDA', error)
//         next(error)
//     }
// });

router.get('/daily', async (req, res, next) => {
    try {
        const { data: { data } } = await axios.get(`https://corona-api.com/timeline`);
        // console.log('data?', data)
        console.log('data.length', data.length)
        const modifiedData = data.map((dailyData) => ({
            confirmed: dailyData.new_confirmed,
            deaths: dailyData.new_deaths,
            date: dailyData.date
        }))
        console.log('newModifiedData', modifiedData)
        res.send(modifiedData)
    } catch (error) {
        console.error('DEU MERDA', error)
        next(error)
    }
});

// router.get('/daily', async (req, res, next) => {
//     try {
//         const { data } = await axios.get(`https://corona-api.com/countries?include=timeline`);
//         const modifiedData = data.data.map((country, idx) => {
//             if (country.timeline) {
//                 // console.log(country.name)
//                 return country.timeline.map((date) => {
//                     let obj = {
//                         confirmed: date.confirmed,
//                         deaths: date.deaths,
//                         date: date.date
//                     }
//                     return obj
//                 })
//             }
//         })
//         // console.log('newModifiedData', modifiedData)
//         res.send(modifiedData.flat(Infinity))
//     } catch (error) {
//         console.error('DEU MERDA', error)
//         next(error)
//     }
// });

// router.get('/daily', async (req, res, next) => {
//     try {
//         const { data } = await axios.get(`${url}/daily`);
//         const modifiedData = data.map((dailyData) => ({
//             confirmed: dailyData.confirmed.total,
//             deaths: dailyData.deaths.total,
//             date: dailyData.reportDate
//         }))
//         console.log('old modified data', modifiedData)
//         res.send(modifiedData)
//     } catch (error) {
//         console.error('DEU MERDA', error)
//         next(error)
//     }
// });

router.get('/countries', async (req, res, next) => {
    try {
    //    const { data: { countries } } = await axios.get(`${url}/countries`);
       const { data: { data: countries } } = await axios.get(`https://corona-api.com/countries`);
       const modifiedData = countries.map((country) => {
           return {
               country: country.name,
               code: country.code
           }
           }).sort((a, b) => {
               return (a.country.toUpperCase() < b.country.toUpperCase()) ? -1 : (b.country.toUpperCase() < a.country.toUpperCase()) ? 1 : 0
           })
       console.log(modifiedData)
       res.send(modifiedData) 
    } catch (error) {
        console.error('DEU MERDA', error)
        next(error)
    }
});

router.get('/country/:country', async (req, res, next) => {
    try {
        const country = req.params.country;
        const { data: { cases: confirmed, recovered, deaths, countryInfo, updated: lastUpdate } } = await axios.get(`https://disease.sh/v3/covid-19/countries/${country}`);
        // const { data: { data: { timeline: { deaths, confirmed, recovered, date: lastUpdate } } } } = await axios.get(`https://corona-api.com/countries/${country}`)
        const modifiedData = {confirmed, recovered, deaths, lastUpdate, flag: {value: countryInfo.flag}}
        console.log('specific country', modifiedData)
        res.send(modifiedData)
    } catch (error) {
        console.error('DEU MERDA', error)
        next(error)
    }
});

// router.get('/country/:country', async (req, res, next) => {
//     try {
//         const { data: { data: { timeline: data } } } = await axios.get(`https://corona-api.com/countries/${req.params.country}`);
//         // console.log('data?', data)
//         console.log('data.length', data.length)
//         const modifiedData = data.map((dailyData) => ({
//             confirmed: dailyData.new_confirmed,
//             deaths: dailyData.new_deaths,
//             date: dailyData.date
//         }))
//         console.log('newModifiedData', modifiedData)
//         res.send(modifiedData)
//     } catch (error) {
//         console.error('DEU MERDA', error)
//         next(error)
//     }
// });




module.exports = router




/*

router.get('/all', async (req, res, next) => {
    try {
        const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(url);
        const modifiedData = {
            confirmed,
            recovered,
            deaths,
            lastUpdate
        }
        res.send(modifiedData)
    } catch (error) {
        console.error("DEU MERDA", error)
        next(error)
    }
});



///testing///
router.get('/all', async (req, res, next) => {
    try {
        const { data } = await axios.get(`https://disease.sh/v3/covid-19/countries`);
        const modifiedData = data.map(({cases, recovered, deaths}) => ({confirmed: {value: cases}, recovered: {value: recovered}, deaths: {value: deaths}}))
        console.log(modifiedData)
        res.send(modifiedData)
    } catch (error) {
        console.error("DEU MERDA", error)
        next(error)
    }
});



router.get('/country/:country', async (req, res, next) => {
    try {
        const country = req.params.country;
        const { data } = await axios.get(`${url}/countries/${country}`);
        console.log(data)
        res.send(data)
    } catch (error) {
        console.error('DEU MERDA', error)
        next(error)
    }
});

*/