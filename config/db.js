/**
 * @type - Database Config
 * @description - Connects application to DB
 */

require('dotenv').config()
const mongoose = require("mongoose")

mongoose.set('strictQuery', false)

// connection string
let MONGOURI = process.env.DEV_MONGODB_URL
if (process.env.ENVIRONMENT === "prod") {
  MONGOURI = process.env.PROD_MONGODB_URL
}

// connect to mongo db
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    })
    console.log("Connected to Mongo DB instance")
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports = InitiateMongoServer