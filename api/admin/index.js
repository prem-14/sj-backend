const express = require('express')

const jwt = require('jsonwebtoken')

const app = express.Router()

const user = require('./routes/user')
const auth = require('./routes/auth')
const package = require('./routes/package')

app.use('/user', user)
app.use('/auth', auth)
app.use('/package', package)

module.exports = app
