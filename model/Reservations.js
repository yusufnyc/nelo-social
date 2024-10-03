/**
 * @type - Model
 * @description - Defines Reservation Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

// Restaurant Schema
const ReservationSchema = Schema({
  diners: {
    type: Array,
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