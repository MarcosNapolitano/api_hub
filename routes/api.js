'use strict';

import pkg from 'body-parser';
const { urlencoded } = pkg;
import ConvertHandler from '../controllers/convertHandler.js';

export default function (app) {

  app.use(urlencoded({ extended: false }));
  
  app.route('/api/convert').get(function(req,res){
    //stores and separates unit from number
    const query = req.query.input
    const convert = new ConvertHandler();
    const initNum = convert.getNum(query)
    const initUnit = convert.getUnit(query)
    
    if(!initNum && !initUnit){
      return res.json({error:'invalid number and unit'})
    }else if(!initUnit){
      return res.json({error : 'invalid unit'})
    }else if(!initNum){
      return res.json({error: 'invalid number'})
    }
    
    const returnNum = convert.convert(initNum,initUnit)
    const returnUnit = convert.getReturnUnit(initUnit)
    const spelledInUnit = convert.spellOutUnit(initUnit)
    const spelledReUnit = convert.spellOutUnit(returnUnit)
    const string = convert.getString(initNum,spelledInUnit,returnNum,spelledReUnit)

    res.json({ initNum: initNum, 
              initUnit: initUnit, 
              returnNum: returnNum, 
              returnUnit: returnUnit, 
              string: string})
    
  }).post(function(req,res){
    //stores and separates unit from number
    const query = req.body.input
    const convert = new ConvertHandler();
    const initNum = convert.getNum(query)
    const initUnit = convert.getUnit(query)

    if(!initNum && !initUnit){
      return res.json({error:'invalid number and unit'})
    }else if(!initUnit){
      return res.json({error : 'invalid unit'})
    }else if(!initNum){
      return res.json({error: 'invalid number'})
    }
    
    const returnNum = convert.convert(initNum,initUnit)
    const returnUnit = convert.getReturnUnit(initUnit)
    const spelledInUnit = convert.spellOutUnit(initUnit)
    const spelledReUnit = convert.spellOutUnit(returnUnit)
    const string = convert.getString(initNum,spelledInUnit,returnNum,spelledReUnit)
    
    res.json({ initNum: initNum, 
              initUnit: initUnit, 
              returnNum: returnNum, 
              returnUnit: returnUnit, 
              string: string})
  })

};
