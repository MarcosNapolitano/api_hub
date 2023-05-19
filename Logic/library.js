'use strict';

import mongoose from 'mongoose';
import * as dotenv from 'dotenv' 
//to read env vars
dotenv.config()

//strings for error handling
const saveError = "Could not save the element in the database\n\n"
const findError = "Could not find the element in the database\n\n"
const delError = "Could not delete the element from the database\n\n"


//this changes to the second cluster
const conn = mongoose.createConnection(process.env.MONGO_URI_LB);

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
  commentcount: { type: Number, default: 0 }
},{versionKey:false});

//now models look like this because of the cluster change
const Book = conn.model("Book", bookSchema);


export async function findAllBooks(res){

  //response will be an array of book objects

  await Book.find({}).select({title:1, commentcount:1})
  .then(data => res.json(data))
  .catch(err => {
    console.error(findError + err) 
    return res.send(findError)})
  
  //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
}

export async function postBook(req, res){
  
  const title = req.body.title;

  if(!title) return res.send("missing required field title")
  
  const newBook = new Book({title: title});
  await newBook.save().then(data => res.json({title: title, _id: data.id}))
  .catch(err => {
    console.error(findError + err) 
    return res.send(findError)});
  
  //response will contain new book object including atleast _id and title
}

export async function deleteAllBooks(res){
  //if successful response will be 'complete delete successful'
  await Book.deleteMany({}).then(res.send("complete delete successful"))
  .catch(err => {
    console.error(delError + err) 
    return res.send(delError)})

};




export async function getBookById(req, res){

  await Book.findById({_id:req.params.id}).select({title:1, comments:1})
  .then(data => res.json(data))
  .catch(err => {
    console.error(findError + err) 
    return res.send(findError)})

  //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
};

export async function postComment(req, res){

  const bookid = req.params.id;
  const comment = req.body.comment;

  if(!comment) return res.send("missing required field comment")

  
  await Book.findById({_id:bookid}).select({title:1, comments:1, commentcount:1})
  .then(data => {

    data.comments.push(comment)
    data.commentcount+=1
    data.save().then(data => {

      //json res format same as .get
      return res.json({_id: data["_id"], title : data.title, comments: data.comments})

    }).catch(err => {
      console.error(saveError + err) 
      return res.send(saveError)})

  }).catch(err => {
    console.error(findError + err) 
    return res.send(findError)})
      

}
  
  

export async function deleteBook(req, res){

  //if successful response will be 'delete successful'
  await Book.findByIdAndRemove({_id:req.params.id}).then(res.send('delete successful'))
  .catch(err =>{
    console.error(findError + err)
    return res.send("no book exists")
  })

}

