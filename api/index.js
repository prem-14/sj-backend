const express = require('express')
const admin = require('./admin')

const app = express.Router()

app.use(['/admin'], admin)

module.exports = app
