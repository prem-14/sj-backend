const index = require('../api')
const AppError = require('../middleware/error')
const globalErrorHandler = require('../middleware/error/errorHandler')

module.exports = (app) => {
  app.use(['/api/v1'], index)
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
  })
  app.use(globalErrorHandler)
}
