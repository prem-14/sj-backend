const express = require('express')

const jwt = require('jsonwebtoken')

const app = express.Router()

const user = require('./routes/user')
const auth = require('./routes/auth')

app.use('/user', user)
app.use('/auth', auth)

module.exports = app
