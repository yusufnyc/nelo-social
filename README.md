### Nelo project: Social Restaurant Booking API

# GET /api/restaurants
- params - diner_ids (Array), epoch_datetime (String)
- description - Returns all available restaurants that meet group requirements

# POST /api/reservations
- params - restaurant_id (String), diner_ids (Array), epoch_datetime (String)
- description - Creates a reservation if there is an availability


### Notes
- Mock diner and restaurant data is automatically generated in the database through /helpers/createFakeData. 
- FYI: Diners and Restaurants have unique database ID's
- You are able to create reservations in the past since there was no explicit constraint.
