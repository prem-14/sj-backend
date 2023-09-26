
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const express = require('express')
const loaders = require('./loaders')
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const startServer = async () => {
    const app = express()
    await loaders(app)
}

startServer()
