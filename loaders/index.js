const expressLoader = require('./express')
const mongodbLoader = require('./mongodb')
const routesLoader = require('./routes')
const connectionLoader = require('./connection')

module.exports = async (app) => {
  await mongodbLoader()
  await expressLoader(app)
  await routesLoader(app)
  await connectionLoader(app)
}
