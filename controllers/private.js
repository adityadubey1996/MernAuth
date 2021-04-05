const privateRoute = (req, res, next) => {
  res.status(200).json({
    message: 'Private Route',
  })
}
module.exports = { privateRoute }
