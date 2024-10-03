### Nelo project: Social Restaurant Booking API
This is designed to be close to actual work - you can use Google, use any language and
libraries, and use a database. Feel free to use the database for as much or as little as you
would do in real-life, there is no need to implement something in code if you would normally do
with a database operation. Write this as if it were production code.
Product requirements
We’re building the backend for an app that allows users to do the following: with a group of
friends, find a restaurant that fits the dietary restrictions of the whole group, with an available
table at a specific time, and then create a reservation for that group and time.
Our world has the following:
● Diners
  ○ Name
  ○ Zero or more dietary restrictions (“Vegan”, “Vegetarian”, “Paleo”, etc.)
● Restaurants
  ○ Name
  ○ Zero or more endorsements (“Vegan-friendly”, “Vegetarian-friendly”, “Paleo-friendly”)

● Tables
  ○ Capacity (e.g. Seats 4 people)
● Reservations
  ○ Table
  ○ Diners
  ○ Time

To start the project, create diners, restaurants, and tables in bulk or hard-code these. We do not
need API endpoints to create these. We have linked a Google Sheet of data you can use to
start. (This is not supposed to be representative of the database structure, you likely want to
model this differently in your solution).
Assume that reservations last 2 hours.
With this starting point, build endpoints to do the following:
● An endpoint to find restaurants with an available table for a group of users at a specific
time.
  ○ Example: Jack, Jill and Jane are looking for a reservation at 7:30pm on Tuesday. Return a list of restaurants with an available table (for that many people or more) at that time, which meets all of the group’s dietary requirements.

● An endpoint that creates a reservation for a group of users. This will always be called
after the search endpoint above.

Out of scope
Only the API is in scope - the UI is out of scope. Authentication is out of scope. Don’t worry
about hosting this somewhere publicly accessible - we can run it on your local machine.
Deliverable
Please send us a link to a git repo. If the repo is private, please


### Data

#### Restaurants
Name	No. of two-top tables	No. of four-top tables	No. of six-top tables	Endorsements
Lardo	4	2	1	Gluten Free Options
Panadería Rosetta	3	2	0	Vegetarian-Friendly, Gluten Free Options
Tetetlán	4	2	1	Paleo-friendly, Gluten Free Options
Falling Piano Brewing Co	5	5	5	
u.to.pi.a	2	0	0	Vegan-Friendly, Vegetarian-Friendly

#### Diners
Name	Home Location	Dietary Restrictions
Michael	19.4153107,-99.1804722	Vegetarian
George Michael	19.4058242,-99.1671942	Vegetarian, Gluten-Free
Lucile	19.3634215,-99.1769323	Gluten-Free
Gob	19.3318331,-99.2078983	Paleo
Tobias	19.4384214,-99.2036906	
Maeby	19.4349474,-99.1419256	Vegan