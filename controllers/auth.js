const User = require('../models/auth')
const errorResponse = require('../utils/errorResponse')
const register = async (req, res, next) => {
  const { username, email, password } = req.body
  console.log('register -> req.body', req.body)
  try {
    const userCheck = await User.findOne({ email }).select('+password')
    console.log('register -> userCheck', userCheck)
    if (userCheck) {
      return next(new errorResponse('Email already exist', 400))
    } else {
      const user = await User.create({
        username,
        email,
        password,
      })
      sendToken(user, 201, res)
    }
  } catch (err) {
    // res.status(400).json({
    //   sucess: false,
    //   message: err.message,
    // })
    next(err)
  }
}
const EmailStateFalse = async (req, res, next) => {
  const { emailstate, email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return next(new errorResponse('user not found', 401))
    } else {
      console.log('EmailStatechange -> user', user)

      let sv = await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: { emailState: false },
        }
      )
      if (sv) {
        res.status(200).json({
          success: true,
          message: 'state changed to false',
        })
      } else {
        return next(new errorResponse('Something went wrong', 401))
      }
    }
  } catch (err) {
    next(err)
  }
}
const EmailStatechange = async (req, res, next) => {
  const { emailstate, email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return next(new errorResponse('user not found', 401))
    } else {
      console.log('EmailStatechange -> user', user)

      let sv = await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: { emailState: true },
        }
      )
      if (sv) {
        res.status(200).json({
          success: true,
          message: 'state changed to true',
        })
      } else {
        return next(new errorResponse('Something went wrong', 401))
      }
    }
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new errorResponse('Please provide email and password', 400))
    // res.status(400).json({ sucess: true, error: 'Please provide email and password' })
  }
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(new errorResponse('Invalid credentials', 401))

      //   res.status(404).json({
      //     success: false,
      //     error: 'Invalid credentials',
      //   })
    }
    const isMatch = await user.matchPasswords(password)

    if (!isMatch) {
      return next(new errorResponse('Invalid credentials', 401))

      //   res.status(404).json({
      //     success: false,
      //     error: 'Invalid credentials',
      //   })
    }

    sendToken(user, 200, res)
  } catch (error) {
    // res.status(500).json({
    //   sucess: false,
    //   message: error.message,
    // })
    next(err)
  }
}

const forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await User.findOne(email)
    if (!user) {
      return next(new errorResponse('User not found', 401))
    }
    const resetToken = user.getResetToken()
    console.log('forgotPassword -> resetToken', resetToken)

    await user.save()
    const resetUrl = `http://localhost:${PORT}/resetPassword/${resetToken}`

    console.log('forgotPassword -> resetUrl', resetUrl)
  } catch (error) {
    return next(new errorResponse(error, 401))
  }
}

const resetpassword = (req, res, next) => {
  res.send('resetpassword route')
}

const sendToken = (user, statuscode, res) => {
  const token = user.getSignedToken()

  res.status(statuscode).json({
    sucees: true,
    token: token,
    user: user,
  })
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetpassword,
  EmailStatechange,
  EmailStateFalse,
}
