const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const ApiError = require('./utils/ApiError')
const httpStatus = require('http-status')

const { errorHandler } = require('./middlewares/error')
const routes = require('./routes')

const app = express()

// set security HTTP headers - https://helmetjs.github.io/
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// Reroute all API request starting with "/" route
app.use('/v1', routes)

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
})

app.use(errorHandler)

module.exports = app
