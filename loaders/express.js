const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const fileUpload = require('express-fileupload')

module.exports = async (app) => {
  app.use(helmet())
  app.use(compression())
  app.use(express.static(path.join(__dirname, '../public')))

  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(
    express.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    })
  )

  app.use(
    fileUpload({
      useTempFiles: true,
    })
  )

  process
    .on('uncaughtException', (err) => {
      console.log(`exception error==${err}`)
      process.exit(1)
    })
    .on('unhandledRejection', (err) => {
      console.log(`rejection error==${err}`)
      process.exit(1)
    })
}
