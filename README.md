# OnTheClok
### An App that takes the hard work out of scheduling so that you can focus on things that matter.

## <p style="color: green;">Table of Contents</p>
- [Introduction](#introduction)
- [Software Requirements](#software-requirements)
- [Technologies used](#technologies-used)
- [How to install?](#how-to-install)
- [How to get started?](#how-to-get-started)

## <p style="color: green;">Introduction</p>
This App is my back-end capstone project for Nashville Software School. I built it to demonstrate my abilities to build a full stack application.

This app's main aim is to help managers ease their process of making schedules for employees working in their department.

This App has two main views:
- Manager's view
- Employee's View

### Manager's View

Manager can login and they will be presented with options to view all the Employees and can click through each employee to view their details. They can also edit few details on employee's profile. They can create new employee, generate schedule based on employee's availability.

### Employee's View

Employees can login and view their profile and edit it. They can change their availability at any time.

## <p style="color: green;">Software Requirements</p>

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

## <p style="color: green;">Technologies used</p>

- [Express](https://expressjs.com)
- [jQuery](https://jquery.com/)
- [Sequelize-ORM](http://docs.sequelizejs.com/)
- [Bootstrap 4](http://blog.getbootstrap.com/2017/08/10/bootstrap-4-beta/)
- [Passport js](http://www.passportjs.org/)
- [Popper js](https://popper.js.org/)
- [Pug](https://pugjs.org/api/getting-started.html)

## <p style="color: green;">How to Install?</p>

- Clone the project to the desired folder in your directory,
```git clone https://github.com/Arwask/Schedule-app```
- cd into the folder ```cd Schedule-app```
- run ```npm install``` at the root folder

## <p style="color: green;">How to get started?</p>

Create a Database named 'Schedule-App'
- Once you have postgreSQL setup, type ```psql``` in your terminal
- Then, create a new database ```CREATE DATABASE 'Schedule-App';```
- And, connect to the Database ```\c 'Schedule-App'```

Once you are inside the project folder.
- Install all dependencies. Run ```npm install` at the root folder.
- Move Popper, jquery and popper into static/lib/ folder
- Next, go to config folder ``` cd config```
- Make a new file ```touch config.json ```
- Copy the contents from config.example.json and paste it into your config.json and change the username and password fields to your credentials.
- Create the tables and seed them with some starter data using ```npm run dbrb```
- Start the project using ```npm start```

## <p style="color: green;">Developer</p>

[Arwa Kuterwadliwala](https://github.com/Arwask)

<p align="center">&copy; 2017 Arwask</p>
