require('dotenv').config()
const express = require("express")
const { query } = require('express-validator')
const bodyParser = require("body-parser")
const InitiateMongoServer = require("./config/db")
const { HEALTHY } = require("./config/constants")
const createFakeData = require("./helpers/createFakeData")
const Diner = require('./model/Diner')
const Restaurant = require('./model/Restaurant')
const Reservation = require('./model/Reservation')

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

// Generating fake data for db
createFakeData()

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
app.get("/api/restaurants", [
  query('diner_ids').isString().escape(),
  query('epoch_datetime').isLength(8).escape(),
], async (req, res) => {
  // get params
  let diner_ids = req.query.diner_ids
  let diners_arr = diner_ids.split(',');
  let epoch_datetime = req.query.epoch_datetime
  let diners;

   // make sure there are between 1 to 6 diners
   let number_of_diners = diners_arr.length;
   if (number_of_diners == 0 || number_of_diners > 6) {
    return res.status(400).json({ error: 'We only support 1 - 6 diners at this time'});
   }

  // make sure all diners exist
  try {
   diners = await Diner.find({ _id: { $in: diners_arr } }) 
  } catch (err) {
    return res.status(400).json({ error: 'Some diners specified do not exist'});
  }

  // find dietary restrictions of all diners in group
  let groupRestrictions = {}

  diners.forEach((diner) => {
    if (diner.vegan) {
      groupRestrictions.vegan = true;
    } else if (diner.vegetarian) {
      groupRestrictions.vegetarian = true;
    } else if (diner.glutenFreeDiet) {
      groupRestrictions.glutenFreeDiet = true;
    } else if (diner.paleo) {
      groupRestrictions.paleo = true;
    }
  })

  // find all restaurants support their restrictions
  let restaurants = await Restaurant.find(groupRestrictions)

  // find what tables can seat this group and if that size table even exists at those restaurants
  let table_type_for_group = []
  let table_type_for_group_query = {}
  let minimum_table_size = number_of_diners
  if (number_of_diners % 2 != 0) {
    minimum_table_size = number_of_diners + 1
  }

  if (minimum_table_size == 2) {
    table_type_for_group = ["tableForTwo", "tableForFour", "tableForSix"]
    table_type_for_group_query = {$or: [
      { tableForTwo: { $gt: 0 } },
      { tableForFour: { $gt: 0 } },
      { tableForSix: { $gt: 0 } }
    ]}
  } else if (minimum_table_size == 4) {
    table_type_for_group = ["tableForFour", "tableForSix"]
    table_type_for_group_query = {$or: [
      { tableForFour: { $gt: 0 } },
      { tableForSix: { $gt: 0 } }
    ]}
  } else if (minimum_table_size == 6) {
    table_type_for_group = ["tableForSix"]
    table_type_for_group_query = {$or: [
      { tableForSix: { $gt: 0 } }
    ]}
  }

  restaurants = await Restaurant.find({...groupRestrictions, ...table_type_for_group_query})

  // check if those restaurants have a table available at that time
  // find all reservations that are active during that time for table sizes that accomedate the group
  let available_restaurants = []

  for (let restaurant of restaurants) {
    let active_reservations_for_two = [];
    let active_reservations_for_four = [];
    let active_reservations_for_six = [];
    if (minimum_table_size == 2) {
      active_reservations_for_two = await Reservation.find({
        start: {$gte: epoch_datetime},
        end: {$lte: epoch_datetime},
        table_type: {$in: "tableForTwo"},
        restaurant_id: restaurant._id
      });
      active_reservations_for_four = await Reservation.find({
        start: {$gte: epoch_datetime},
        end: {$lte: epoch_datetime},
        table_type: {$in: "tableForFour"},
        restaurant_id: restaurant._id
      });
      active_reservations_for_six = await Reservation.find({
        start: {$gte: epoch_datetime},
        end: {$lte: epoch_datetime},
        table_type: {$in: "tableForSix"},
        restaurant_id: restaurant._id
      });

      if (restaurant.tableForTwo - active_reservations_for_two.length > 0) {
        available_restaurants.push(restaurant)
      } else if (restaurant.tableForFour - active_reservations_for_four.length > 0) {
        available_restaurants.push(restaurant)
      } else if (restaurant.tableForSix - active_reservations_for_six.length > 0) {
        available_restaurants.push(restaurant)
      }
    } else if (minimum_table_size == 4) {
      active_reservations_for_four = await Reservation.find({
        start: {$gte: epoch_datetime},
        end: {$lte: epoch_datetime},
        table_type: {$in: "tableForFour"},
        restaurant_id: restaurant._id
      });
      active_reservations_for_six = await Reservation.find({
        start: {$gte: epoch_datetime},
        end: {$lte: epoch_datetime},
        table_type: {$in: "tableForSix"},
        restaurant_id: restaurant._id
      });
      console.log(active_reservations_for_four.length)
      console.log(restaurant.tableForFour)
      console.log(restaurant.tableForFour - active_reservations_for_four.length > 0)
      if (restaurant.tableForFour - active_reservations_for_four.length > 0) {
        available_restaurants.push(restaurant)
      } else if (restaurant.tableForSix - active_reservations_for_six.length > 0) {
        available_restaurants.push(restaurant)
      }
    } else if (minimum_table_size == 6) {
      active_reservations_for_six = await Reservation.find({
        start: {$gte: epoch_datetime},
        end: {$lte: epoch_datetime},
        table_type: {$in: "tableForSix"},
        restaurant_id: restaurant._id
      });
      if (restaurant.tableForSix - active_reservations_for_six.length > 0) {
        available_restaurants.push(restaurant)
      }
    }
  }

  return res.json(available_restaurants)
})

/**
 * @route - /api/reservations
 * @method - POST
 * @params - diner_ids, epoch_datetime
 * @description - Creates a reservation
 */
app.get("/api/reservations", (req, res) => {
  // validate data

  // verify that there is a reservation available for that time for a table that suites the group
  // create reservation

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

