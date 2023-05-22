'use strict';

import pkg from 'body-parser';
const { urlencoded } = pkg;

//metric api
import ConvertHandler from '../Logic/convertHandler.js';

//urlshortener api
import {checkUrl, postUrl, getUrl, last_Id} from '../Logic/urlShortener.js';

//exercise api
import {createUser, findUsers, createExercise, getLogs} from "../Logic/exercise.js"

//issues api
import issue_DB from '../Logic/issues.js';

//library api
import { deleteAllBooks, deleteBook, findAllBooks, getBookById, postBook, postComment } from '../Logic/library.js';


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

  //headerparser api "index"
  app.route("/api/whoami")
    .get(function(req,res){
      res.sendFile(process.cwd() + '/views/headerparser.html');
  })

  //exercise api "index"
  app.get('/api/exercise', (req, res) => {
    res.sendFile(process.cwd() + '/views/exercise.html')
  });

  //issues api "index"
  app.route('/api/issues').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

  //library api "index"
  app.route('/api/library').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/library.html');
  });

  
  //----------------------------------------------------------//



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
    if(ID=="lastid") return last_Id(res)
    return getUrl(ID, res);

  })


  //header parser api
  app.get('/api/whoami/myinfo', function(req,res){
    res.json({ipaddress:req.ip,language:req.get('accept-language'),software: req.get('user-agent')})
  })


  //exercise api
  app.post('/api/exercise/users',function(req, res){

    //stores username 
    const username = req.body.username

    return createUser(username, res)

  });

  app.get('/api/exercise/users',function(req, res){

    return findUsers(res)
  })

  app.post('/api/exercise/users/:id/exercises', function(req, res){
    
    return createExercise(req, res);
  })

  app.get('/api/exercise/users/:id/logs',function(req, res, next){
    
    return getLogs(req, res) 
  })



  //issues api
  app.route('/api/issues/:project')
  
  .get(function (req, res){
    
    return issue_DB.getIssues(req, res) 
  })
  
  .post(function (req, res){

    return issue_DB.postIssue(req, res)    
  })
  
  .put(function (req, res){
    return issue_DB.updateIssue(req, res)
  })
  
  .delete(function (req, res){

    return issue_DB.deleteIssue(req, res)
  });

  //library api
  app.route('/api/library/books')
  .get(function (req, res){

    return findAllBooks(res)
  })
  
  .post(function (req, res){

    return postBook(req, res)
  })
  
  .delete(function(req, res){

    return deleteAllBooks(res)
  });

  app.route('/api/library/books/:id')
  .get(function (req, res){

    return getBookById(req, res)
  })
  
  .post(function (req, res){

    return postComment(req, res)
  })
  
  .delete(function(req, res){
  
    return deleteBook(req, res);
  });


};
