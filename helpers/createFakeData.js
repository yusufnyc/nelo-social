/*
  Generates fake data in DB
*/

const Diner = require('../model/Diner')
const Restaurant = require('../model/Restaurant')

let createFakeData = async () => {
  const fakeDiners = [
    {
      name: "Michael",
      location: "19.4153107,-99.1804722",
      vegan: true,
      vegetarian: false,
      gluten_free_diet: false,
      paleo: false,
    },
    {
      name: "George Michael",
      location: "19.4058242,-99.1671942",
      vegan: false,
      vegetarian: true,
      gluten_free_diet: true,
      paleo: false,
    },
    {
      name: "Lucile",
      location: "19.3634215,-99.1769323",
      vegan: false,
      vegetarian: false,
      gluten_free_diet: true,
      paleo: false,
    },
    {
      name: "Gob",
      location: "19.3318331,-99.2078983",
      vegan: false,
      vegetarian: false,
      gluten_free_diet: false,
      paleo: true,
    },
    {
      name: "Tobias",
      location: "19.4384214,-99.2036906",
      vegan: false,
      vegetarian: false,
      gluten_free_diet: false,
      paleo: false,
    },
    {
      name: "Maeby",
      location: "19.4349474,-99.1419256",
      vegan: true,
      vegetarian: false,
      gluten_free_diet: false,
      paleo: false,
    },
  ]

  const fakeRestaurants = [
    {
      name: "Lardo",
      table_for_two: 4,
      table_for_four: 2,
      table_for_six: 1,
      vegan: false,
      vegetarian: false,
      gluten_free_diet: true,
      paleo: false,
    },
    {
      name: "Panadería Rosetta",
      table_for_two: 3,
      table_for_four: 2,
      table_for_six: 0,
      vegan: false,
      vegetarian: true,
      gluten_free_diet: true,
      paleo: false,
    },
    {
      name: "Tetetlán",
      table_for_two: 4,
      table_for_four: 2,
      table_for_six: 1,
      vegan: false,
      vegetarian: false,
      gluten_free_diet: true,
      paleo: true,
    },
    {
      name: "Falling Piano Brewing Co",
      table_for_two: 5,
      table_for_four: 5,
      table_for_six: 5,
      vegan: false,
      vegetarian: false,
      gluten_free_diet: false,
      paleo: false,
    },
    {
      name: "u.to.pi.a",
      table_for_two: 2,
      table_for_four: 0,
      table_for_six: 0,
      vegan: true,
      vegetarian: true,
      gluten_free_diet: false,
      paleo: false,
    },
  ]

  // checking if diners and restaurants already exist
  let existingDiners = await Diner.find({})
  let existingRestaurants = await Restaurant.find({})

  if (existingDiners.length == 0) {
    // creating fake diners in db
    fakeDiners.forEach(async (diner) => {
      let newDiner = new Diner({
        name: diner.name,
        location: diner.location,
        vegan: diner.vegan,
        vegetarian: diner.vegetarian,
        gluten_free_diet: diner.gluten_free_diet,
        paleo: diner.paleo
      })

      try {
        await newDiner.save()
      } catch (e) {
        console.log(e)
        return res.status(400).send({errors: 'error creating new diner'})
      }
    })
  }

  if (existingRestaurants.length == 0) {
    // creating fake restaurants in db
    fakeRestaurants.forEach(async (restaurant) => {
      let newRestaurant = new Restaurant({
        name: restaurant.name,
        table_for_two: restaurant.table_for_two,
        table_for_four: restaurant.table_for_four,
        table_for_six: restaurant.table_for_six,
        vegan: restaurant.vegan,
        vegetarian: restaurant.vegetarian,
        gluten_free_diet: restaurant.gluten_free_diet,
        paleo: restaurant.paleo
      })

      try {
        await newRestaurant.save()
      } catch (e) {
        console.log(e)
        return
      }
    })
  }
}

module.exports = createFakeData