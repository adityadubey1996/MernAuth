const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })

  console.log('DB connected')
}
module.exports = connectDB
