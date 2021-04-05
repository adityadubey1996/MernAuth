const express = require('express')

const router = express.Router()

const { register, login, forgotPassword, resetpassword, EmailStatechange, EmailStateFalse } = require('../controllers/auth')

router.route('/register').post(register)
router.route('/EmailStatechange').put(EmailStatechange)
router.route('/EmailStateFalse').put(EmailStateFalse)

router.route('/forgotPassword').post(forgotPassword)
router.route('/login').post(login)
router.route('/resetpassword').post(resetpassword)

module.exports = router
