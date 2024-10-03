/**
 * @type - Model
 * @description - Defines Restaurant Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

// Restaurant Schema
const RestaurantSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  tableForTwo: {
    type: Number,
    required: true,
  },
  tableForFour: {
    type: Number,
    required: true,
  },
  tableForSix: {
    type: Number,
    required: true,
  },
  vegan: {
    type: Boolean,
    default: false
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  glutenFreeDiet: {
    type: Boolean,
    default: false
  },
  paleo: {
    type: Boolean,
    default: false
  }
})

// export model Restaurants
module.exports = mongoose.model('restaurants', RestaurantSchema)