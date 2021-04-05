const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const errorHandler = require('./middleware/error')
const PORT = process.env.PORT || dotenv

const app = express()

app.use(express.json())
const DBconnect = require('./config/db')
DBconnect()
app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/private'))
app.use(errorHandler)
const server = app.listen(PORT, () => {
  console.log(`listening at ${PORT}`)
})
process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error ${err}`)
  server.close(() => process.exit(1))
})
