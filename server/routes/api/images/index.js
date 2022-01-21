const { models: { User, Vaccine }} = require('../../../db');

const router = require('express').Router();

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' }); //specifies destination folder for uploads

const { uploadFile, getFileStream } = require('./s3');

router.get('/:key', (req, res, next) => {
    try {
        console.log(req.params);
        const key = req.params.key;
        const readStream = getFileStream(key);
        console.log('readStream', readStream)
        readStream.pipe(res)
    } catch (error) {
        console.log('deu merda aqui no GET', error);
        next(error)
    }
})

router.post('/:id', upload.single('image'), async (req, res, next) => {
    try {
        const file = req.file; //multer stores file in uploads folder
        console.log('file object', file)

        const result = await uploadFile(file) //send file to S3 and wait for it to be successful
        console.log('result', result)
        await unlinkFile(file.path)

        //find user and add this to their data model: cdcCard: `/api/images/${result.Key}`
        const vaccine = await Vaccine.findOne({
            where: {
                userId: req.params.id
            }
        })
        vaccine.cdcCard = `/api/images/${result.Key}`
        await vaccine.save();

        res.send({imagePath: `/api/images/${result.Key}`})
        //res.send(user)
    } catch (error) {
        console.log('deu merda aqui no POST', error)
        next(error)
    }
});


router.put('/:id', upload.single('image'), async (req, res, next) => {
    try {
        const file = req.file; //multer stores file in uploads folder
        console.log('file object', file)

        const result = await uploadFile(file) //send file to S3 and wait for it to be successful
        console.log('result', result)
        await unlinkFile(file.path)

        //find user and add this to their data model: cdcCard: `/api/images/${result.Key}`
        const vaccine = await Vaccine.findOne({
            where: {
                userId: req.params.id
            }
        })
        vaccine.cdcCard = `/api/images/${result.Key}`
        await vaccine.save();

        res.send({imagePath: `/api/images/${result.Key}`})
        //res.send(user)
    } catch (error) {
        console.log('deu merda aqui no POST', error)
        next(error)
    }
});

router.post('/profile-photo/:id', upload.single('image'), async (req, res, next) => {
    try {
        console.log('ID', req.params.id)

        const file = req.file;
        console.log('profilePhoto file object', file)
        const result = await uploadFile(file) //send file to S3 and wait for it to be successful
        console.log('result', result)
        await unlinkFile(file.path)

        const user = await User.findByPk(req.params.id);
        user.profilePhoto = `/api/images/${result.Key}`
        await user.save()
        res.send(user)
    } catch (error) {
        console.log('DEU MERDA ADDING PROFILE PHOTO')
        next(error)
    }
})

module.exports = router;