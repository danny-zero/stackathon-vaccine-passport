const router = require('express').Router();
//const { reset } = require('nodemon');
const { models: { User, Vaccine }} = require('../../../db');


router.post('/', async(req, res, next)=> {
  try {
    //console.log("made it to post?", req.body)
    const email = req.body.email.toLowerCase()
    const password = req.body.password
    res.send({ token: await User.authenticate(email, password)});
  }
  catch(ex){
    next(ex);
  }
});


router.get('/', async(req, res, next)=> {
  try {
    //console.log("app.js app.get/api/auth", req.headers.authorization)
    res.send(await User.byToken(req.headers.authorization));
  }
  catch(ex){
    // console.log("deu merda aqui")
    // next(ex);
    res.send('deu merda')
  }
});


router.post('/createUser', async(req, res, next)=> {
  try {
    //console.log("made it to post?", req.body) //is there a way to secure the password here? it doesn't seem secure to send it in plain text to the server to be create
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email.toLowerCase()
    const password = req.body.password
    const user = await User.create({firstName, lastName, email, password})
    //console.log('user create?', user)
    res.send({ token: await User.authenticate(email, password)});
    // res.send({ token: await User.create(req.body)});
  }
  catch(ex){
    next(ex);
  }
});

router.post('/createVaccine/:id', async(req, res, next)=> {
  try {
    // console.log('REQ.BODY', req.body) //this is working, I am getting {id: , vaccine: , firstDose: , secondDose: }  
    const user = await User.findByPk(req.params.id);
    //console.log('found the user for the vaccine?', user)
    const vaccineName = req.body.vaccine;
    const firstDose = req.body.firstDose;
    let secondDose = null;
    let booster = null;
    if (req.body.secondDose.length > 0) {
      secondDose = req.body.secondDose
    }
    if (req.body.booster.length > 0) {
      booster = req.body.booster
    }
    const vaccine = await Vaccine.create({name: vaccineName, firstDose, secondDose, booster});
    vaccine.userId = user.id
    await vaccine.save()
    //console.log('was the vaccine created and is there a user?', vaccine) 
    res.send(vaccine)
  }
  catch(ex){
    next(ex);
  }
});

router.put('/editVaccine/:id', async(req, res, next)=> {
  try {
    console.log('REQ.BODY', req.body)
    const vaccine = await Vaccine.findOne({where: {userId: req.params.id}})
    console.log('found the vaccine?', vaccine)
    console.log('vaccine name', vaccine.name);
    if (req.body.secondDose !== null) vaccine.secondDose = req.body.secondDose;
    if (req.body.booster !== null) vaccine.booster = req.body.booster;
    await vaccine.save()
    console.log('was the vaccine edited?', vaccine) 
    res.send(vaccine)
  }
  catch(ex){
    next(ex);
  }
});

module.exports = router;