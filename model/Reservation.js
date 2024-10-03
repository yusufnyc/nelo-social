/**
 * @type - Model
 * @description - Defines Reservation Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

// Restaurant Schema
const ReservationSchema = Schema({
  diners_id: {
    type: Array,
    required: true,
  },
  restaurant_id: {
    type: String,
    required: true,
  },
  table_type: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
})

// export model Reservations
module.exports = mongoose.model('reservations', ReservationSchema)