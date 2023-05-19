'use strict';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv' 
import pkg from 'body-parser';

const { json, urlencoded } = pkg;

//express app
let app = express();

//to read env vars
dotenv.config()

//connects to the env file containing the mongo string

//try catch in case smth goes wrong
try{
  await mongoose.connect(process.env.MONGO_URI_EX);
  
}catch (error){
  console.error("Could not connect to DataBase\n\n" + error)
}

//if error after connection
mongoose.connection.on('error', err => {
  console.error("Connection to DataBase lost\n\n" + err);
});

//static files
app.use('/public', express.static(process.cwd() + '/public'));
//Letting external host interact
app.use(cors({origin: '*'}));
//Returns middleware that only parses json
app.use(json());
//for post requests
app.use(urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });



//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

//Start server
app.listen(port, function () {
  console.log("Listening on port " + port);
});


