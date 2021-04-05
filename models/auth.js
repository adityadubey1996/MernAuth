const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'PLease provide a username'],
  },
  email: {
    type: String,
    required: [true, 'PLease provide a email'],
    unique: true,
    match: [
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
      'Please provide a valid email',
    ],
  },
  emailState: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordtoken: String,
  resetPasswordExpire: Date,
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}
UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      password: this.password,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

UserSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordtoken = crypto.createHash('sha256').update(resetToken).digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

  return resetToken
}

const user = mongoose.model('User', UserSchema)

module.exports = user
