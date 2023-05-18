'use strict';

import pkg from 'body-parser';
const { urlencoded } = pkg;

//metric api
import ConvertHandler from '../Logic/convertHandler.js';

//urlshortener api
import {checkUrl, postUrl, getUrl} from '../Logic/urlShortener.js';

export default function (app) {

  //for post request
  app.use(urlencoded({ extended: false }));

  //metric api "index"
  app.route("/api/convert")
    .get(function(req,res){
      res.sendFile(process.cwd() + '/views/metric.html');
  })

  //urlshortener api "index"
  app.route("/api/urlshortener")
    .get(function(req,res){
      res.sendFile(process.cwd() + '/views/urlshortener.html');
  })




  //metric api object creation 
  const implement = function(query, res){

    const convert = new ConvertHandler(query,res);
    const initNum = convert.Num
    const initUnit = convert.Unit
  
    //checks if there's an invalid value and returns json
    convert.checkInput()
    if(!convert.convert()){
      return undefined
    }
    convert.setReturnUnit()

    return res.json({ initNum: initNum, 
              initUnit: initUnit, 
              returnNum: convert.result, 
              returnUnit: convert.returnUnit, 
              string: convert.getString()})
  }
  //metric api
  app.route('/api/convert/convert').get(function(req,res){

    //stores and separates unit from number
    const query = req.query.input
    implement(query,res)
    
  })



  // hello api
  app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
  });



  //url shortener api
  app.post('/api/urlshortener', function(req, res) {

    const ORIGINAL_URL = req.body.url;

    if(!checkUrl(ORIGINAL_URL)){
      return res.json({"error": "invalid URL"});
    }

    return postUrl(ORIGINAL_URL,res)
    
  });

  app.get('/api/urlshortener/:id', (req, res) => {

    const ID = req.params.id;
    return getUrl(ID, res);

  })

};
