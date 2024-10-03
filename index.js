require('dotenv').config()
const express = require("express")
const { query, validationResult } = require('express-validator')
const bodyParser = require("body-parser")
const moment = require('moment');

const InitiateMongoServer = require("./config/db")
const { HEALTHY } = require("./config/constants")
const createFakeData = require("./helpers/createFakeData")

const Diner = require('./model/Diner')
const Restaurant = require('./model/Restaurant')
const Reservation = require('./model/Reservation')

// Initiate Mongo Server
InitiateMongoServer()

// PORT
const PORT = process.env.PORT || 3000

// Define app
const app = express()

// Middleware
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
  // checking for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  // getting params
  let diner_ids = req.query.diner_ids
  let diners_arr = diner_ids.split(',')
  let epoch_datetime = req.query.epoch_datetime
  let diners

  // making sure there are between 1 to 6 diners
  let number_of_diners = diners_arr.length
  if (number_of_diners == 0 || number_of_diners > 6) {
    return res.status(400).json({ error: 'We only support 1 - 6 diners at this time'})
  }

  // making sure all diners exist
  try {
   diners = await Diner.find({ _id: { $in: diners_arr } }) 
  } catch (err) {
    return res.status(400).json({ error: 'Some diners specified do not exist'})
  }

  // find dietary restrictions of all diners in group
  let group_restrictions = {}
  diners.forEach((diner) => {
    if (diner.vegan) {
      group_restrictions.vegan = true
    } else if (diner.vegetarian) {
      group_restrictions.vegetarian = true
    } else if (diner.gluten_free_diet) {
      group_restrictions.gluten_free_diet = true
    } else if (diner.paleo) {
      group_restrictions.paleo = true
    }
  })

  // find minimum table size and if that table size exists at restaurants
  let table_type_for_group_query = {}
  let minimum_table_size = number_of_diners
  if (number_of_diners % 2 != 0) {
    minimum_table_size = number_of_diners + 1
  }

  if (minimum_table_size == 2) {
    table_type_for_group_query = {$or: [
      { table_for_two: { $gt: 0 } },
      { table_for_four: { $gt: 0 } },
      { table_for_six: { $gt: 0 } }
    ]}
  } else if (minimum_table_size == 4) {
    table_type_for_group_query = {$or: [
      { table_for_four: { $gt: 0 } },
      { table_for_six: { $gt: 0 } }
    ]}
  } else if (minimum_table_size == 6) {
    table_type_for_group_query = {$or: [
      { table_for_six: { $gt: 0 } }
    ]}
  }

  // find all restaurants that support their restrictions and their group size
  let restaurants = await Restaurant.find({...group_restrictions, ...table_type_for_group_query})

  // check if those restaurants have a table available at that time
  let available_restaurants = []
  let new_reservation_start = epoch_datetime;
  let new_reservation_end = Number(epoch_datetime) + 7201; 

  for (let restaurant of restaurants) {
    let active_reservations_for_two = []
    let active_reservations_for_four = []
    let active_reservations_for_six = []
    if (minimum_table_size == 2) {
      active_reservations_for_two = await Reservation.find({
        start: { $lt: new_reservation_end },
        end: { $gt: new_reservation_start },
        table_type: "table_for_two",
        restaurant_id: restaurant._id
      })
      if (restaurant.table_for_two - active_reservations_for_two.length > 0) {
        available_restaurants.push(restaurant)
        continue
      }
      active_reservations_for_four = await Reservation.find({
        start: { $lt: new_reservation_end },
        end: { $gt: new_reservation_start },
        table_type: "table_for_four",
        restaurant_id: restaurant._id
      })
      if (restaurant.table_for_four - active_reservations_for_four.length > 0) {
        available_restaurants.push(restaurant)
        continue
      }
      active_reservations_for_six = await Reservation.find({
        start: { $lt: new_reservation_end },
        end: { $gt: new_reservation_start },
        table_type: "table_for_six",
        restaurant_id: restaurant._id
      })
      if (restaurant.table_for_six - active_reservations_for_six.length > 0) {
        available_restaurants.push(restaurant)
      }
    } else if (minimum_table_size == 4) {
      active_reservations_for_four = await Reservation.find({
        start: { $lt: new_reservation_end },
        end: { $gt: new_reservation_start },
        table_type: "table_for_four",
        restaurant_id: restaurant._id
      })
      if (restaurant.table_for_four - active_reservations_for_four.length > 0) {
        available_restaurants.push(restaurant)
        continue
      }
      active_reservations_for_six = await Reservation.find({
        start: { $lt: new_reservation_end },
        end: { $gt: new_reservation_start },
        table_type: "table_for_six",
        restaurant_id: restaurant._id
      })
      if (restaurant.table_for_six - active_reservations_for_six.length > 0) {
        available_restaurants.push(restaurant)
      }
    } else if (minimum_table_size == 6) {
      active_reservations_for_six = await Reservation.find({
        start: { $lt: new_reservation_end },
        end: { $gt: new_reservation_start },
        table_type: "table_for_six",
        restaurant_id: restaurant._id
      })
      if (restaurant.table_for_six - active_reservations_for_six.length > 0) {
        available_restaurants.push(restaurant)
      }
    }
  }

  return res.json(available_restaurants)
})

/**
 * @route - /api/reservations
 * @method - POST
 * @params - restaurant_id, diner_ids, epoch_datetime
 * @description - Creates a reservation
 */
app.get("/api/reservations", [
  query('restaurant_id').isString().isLength(24).escape(),
  query('diner_ids').isString().escape(),
  query('epoch_datetime').isLength(8).escape(),
], async (req, res) => {
  // checking for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // getting param data
  let restaurant_id = req.query.restaurant_id
  let diner_ids = req.query.diner_ids
  let diners_arr = diner_ids.split(',')
  let epoch_datetime = req.query.epoch_datetime
  let diners
  let restaurant

  // making sure there are between 1 to 6 diners
  let number_of_diners = diners_arr.length
  if (number_of_diners == 0 || number_of_diners > 6) {
    return res.status(400).json({ error: 'We only support 1 - 6 diners at this time'})
  }

  // making sure all diners exist
  try {
    diners = await Diner.find({ _id: { $in: diners_arr } }) 
  } catch (err) {
    return res.status(400).json({ error: 'Some diners specified do not exist'})
  }

  // making sure the restaurant exists
  try {
    restaurant = await Restaurant.findOne({ _id: restaurant_id }) 
  } catch (err) {
    return res.status(400).json({ error: 'Restaurant does not exist'})
  }

  // verify that there's a reservation available for that time for the group size
  let reservation_available = false
  let table_type = "table_for_six"
  let minimum_table_size = number_of_diners
  if (number_of_diners % 2 != 0) {
    minimum_table_size = number_of_diners + 1
  }
  let new_reservation_start = epoch_datetime;
  let new_reservation_end = Number(epoch_datetime) + 7201; 

  if (minimum_table_size == 2) {
    active_reservations_for_two = await Reservation.find({
      start: { $lt: new_reservation_end },
      end: { $gt: new_reservation_start },
      table_type: "table_for_two",
      restaurant_id: restaurant._id
    })
    if (restaurant.table_for_two - active_reservations_for_two.length > 0) {
      reservation_available = true
      table_type = "table_for_two"
    }
    active_reservations_for_four = await Reservation.find({
      start: { $lt: new_reservation_end },
      end: { $gt: new_reservation_start },
      table_type: "table_for_four",
      restaurant_id: restaurant._id
    })
    if (restaurant.table_for_four - active_reservations_for_four.length > 0) {
      reservation_available = true
      table_type = "table_for_four"
    }
    active_reservations_for_six = await Reservation.find({
      start: { $lt: new_reservation_end },
      end: { $gt: new_reservation_start },
      table_type: "table_for_six",
      restaurant_id: restaurant._id
    })
    if (restaurant.table_for_six - active_reservations_for_six.length > 0) {
      reservation_available = true
      table_type = "table_for_six"
    }
  } else if (minimum_table_size == 4) {
    active_reservations_for_four = await Reservation.find({
      start: { $lt: new_reservation_end },
      end: { $gt: new_reservation_start },
      table_type: "table_for_four",
      restaurant_id: restaurant._id
    })
    if (restaurant.table_for_four - active_reservations_for_four.length > 0) {
      reservation_available = true
      table_type = "table_for_four"
    }
    active_reservations_for_six = await Reservation.find({
      start: { $lt: new_reservation_end },
      end: { $gt: new_reservation_start },
      table_type: "table_for_six",
      restaurant_id: restaurant._id
    })
    if (restaurant.table_for_six - active_reservations_for_six.length > 0) {
      reservation_available = true
      table_type = "table_for_six"
    }
  } else if (minimum_table_size == 6) {
    active_reservations_for_six = await Reservation.find({
      start: { $lt: new_reservation_end },
      end: { $gt: new_reservation_start },
      table_type: "table_for_six",
      restaurant_id: restaurant._id
    })
    if (restaurant.table_for_six - active_reservations_for_six.length > 0) {
      reservation_available = true
    }
  }

  if (reservation_available) {
    // create reservation
    let newReservation = new Reservation({
      restaurant_id: restaurant_id,
      diner_ids: diners_arr,
      table_type: table_type,
      start: epoch_datetime,
      end: Number(epoch_datetime) + 7201
    })

    try {
      await newReservation.save()
      let date = moment(epoch_datetime * 1000);
      return res.json({message: "Reservation created at " + restaurant.name + " for " + date.format('MMMM Do YYYY, h:mm:ss a')})
    } catch (e) {
      console.log(e)
      return res.status(400).send({errors: 'error creating new reservation'})
    }
  } else {
    return res.json({message: "Reservation is not available"})
  }
})

/**
 * @route - * CATCH ALL
 * @method - * CATCH ALL
 * @description - 404
 */app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  })
})

// Start app
app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`)
})

