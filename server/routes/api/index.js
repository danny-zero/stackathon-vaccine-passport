const router = require('express').Router()

router.use('/tracker', require('./tracker'));
router.use('/auth', require('./auth'));
router.use('/images', require('./images'))

module.exports = router