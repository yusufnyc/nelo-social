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
  table_for_two: {
    type: Number,
    required: true,
  },
  table_for_four: {
    type: Number,
    required: true,
  },
  table_for_six: {
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
  gluten_free_diet: {
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