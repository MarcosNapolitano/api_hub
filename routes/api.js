'use strict';

import pkg from 'body-parser';
const { urlencoded } = pkg;
import ConvertHandler from '../Logic/convertHandler.js';

export default function (app) {

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

  app.use(urlencoded({ extended: false }));
  
  app.route('/api/convert').get(function(req,res){

    //stores and separates unit from number
    const query = req.query.input
    implement(query,res)
    
  }).post(function(req,res){

    const query = req.body.input
    implement(query, res)

  })

};
