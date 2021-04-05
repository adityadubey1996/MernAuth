const express = require('express')

const router = express.Router()

const { privateRoute } = require('../controllers/private')
const { protect } = require('../middleware/auth')
router.route('/privateRoute').get(protect, privateRoute)

module.exports = router
