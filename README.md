# Express_Game_Library
An application where you can save your completed video games. Made with node.js and a postgreSQL database.

Page is using body-parser, ejs, express, PostgreSQL to store data. 

Features:
  - Can see all stored games
  - Can read about each selected game
  - Sort by title, date, metacritic or your own rating
  - Can fetch some data about game using rawg.io API
  - Can create, read, update and delete game 

How to use:

1. install PostgreSQL and pgAdmin
2. create database
3. configure your database using .env file
4. open queries.sql, run queries in pgAdmin to create table and insert dummy data
5. get your api key from https://rawg.io/login?forward=developer
6. store your api key to .env
8. open terminal run "npm-i" to install node_modules
9. run the "npm install --global nodemon" to install nodemon globally
10. run "nodemon index.js"
11. open browser, type "localhost:3000 to see page
12. to add,update or delete new games go to admin page "localhost:3000/admin"

![image](https://github.com/makask/Express_Game_Library/assets/16080688/a6545895-0eb0-466c-abdc-10b3730227e4)

