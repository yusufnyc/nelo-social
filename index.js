require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const InitiateMongoServer = require("./config/db")
const { HEALTHY } = require("./config/constants")

// Initiate Mongo Server
InitiateMongoServer()

// Define app
const app = express()

// PORT
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/**
 * @route - /api
 * @method - GET
 * @description - Health check
 */
app.get("/api", (req, res) => {
  return res.json({ message: HEALTHY })
})

/**
 * @route - /api/restaurants
 * @method - GET
 * @params - diner_ids, epoch_datetime
 * @description - Returns restaurants that meet group requirements
 */
app.get("/", (req, res) => {
  return res.json({ message: "Restaurants GET" })
})

/**
 * @route - /api/reservations
 * @method - POST
 * @params - diner_ids, epoch_datetime
 * @description - Creates a reservation
 */
app.get("/", (req, res) => {
  return res.json({ message: "Reservations POST" })
})

// 404
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// Start app
app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`)
})

