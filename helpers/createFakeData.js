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
      glutenFreeDiet: false,
      paleo: false,
    },
    {
      name: "George Michael",
      location: "19.4058242,-99.1671942",
      vegan: false,
      vegetarian: true,
      glutenFreeDiet: true,
      paleo: false,
    },
    {
      name: "Lucile",
      location: "19.3634215,-99.1769323",
      vegan: false,
      vegetarian: false,
      glutenFreeDiet: true,
      paleo: false,
    },
    {
      name: "Gob",
      location: "19.3318331,-99.2078983",
      vegan: false,
      vegetarian: false,
      glutenFreeDiet: false,
      paleo: true,
    },
    {
      name: "Tobias",
      location: "19.4384214,-99.2036906",
      vegan: false,
      vegetarian: false,
      glutenFreeDiet: false,
      paleo: false,
    },
    {
      name: "Maeby",
      location: "19.4349474,-99.1419256",
      vegan: true,
      vegetarian: false,
      glutenFreeDiet: false,
      paleo: false,
    },
  ]

  const fakeRestaurants = [
    {
      name: "Lardo",
      tableForTwo: 4,
      tableForFour: 2,
      tableForSix: 1,
      vegan: false,
      vegetarian: false,
      glutenFreeDiet: true,
      paleo: false,
    },
    {
      name: "Panadería Rosetta",
      tableForTwo: 3,
      tableForFour: 2,
      tableForSix: 0,
      vegan: false,
      vegetarian: true,
      glutenFreeDiet: true,
      paleo: false,
    },
    {
      name: "Tetetlán",
      tableForTwo: 4,
      tableForFour: 2,
      tableForSix: 1,
      vegan: false,
      vegetarian: false,
      glutenFreeDiet: true,
      paleo: true,
    },
    {
      name: "Falling Piano Brewing Co",
      tableForTwo: 5,
      tableForFour: 5,
      tableForSix: 5,
      vegan: false,
      vegetarian: false,
      glutenFreeDiet: false,
      paleo: false,
    },
    {
      name: "u.to.pi.a",
      tableForTwo: 2,
      tableForFour: 0,
      tableForSix: 0,
      vegan: true,
      vegetarian: true,
      glutenFreeDiet: false,
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
        glutenFreeDiet: diner.glutenFreeDiet,
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
        tableForTwo: restaurant.tableForTwo,
        tableForFour: restaurant.tableForFour,
        tableForSix: restaurant.tableForSix,
        vegan: restaurant.vegan,
        vegetarian: restaurant.vegetarian,
        glutenFreeDiet: restaurant.glutenFreeDiet,
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