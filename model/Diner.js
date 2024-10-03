/**
 * @type - Model
 * @description - Defines Diner Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

// Diner Schema
const DinerSchema = Schema({
  name: {
    type: String,
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
  glutenFree: {
    type: Boolean,
    default: false
  },
  paleo: {
    type: Boolean,
    default: false
  }
})

// export model Diner
module.exports = mongoose.model('diner', DinerSchema)