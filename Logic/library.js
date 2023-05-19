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
  .then(data => data? res.json(data) : res.send("empty query"))
  .catch(err => console.error(findError + err));
  
  //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
}

export async function postBook(req, res){
  
  const title = req.body.title;

  if(!title) return res.send("missing required field title")
  
  const newBook = new Book({title: title});
  await newBook.save().then(data => res.json({title: title, _id: data.id}))
  .catch(err => saveError + err);
  
  //response will contain new book object including atleast _id and title
}

export async function deleteAllBooks(res){
  //if successful response will be 'complete delete successful'
  await Book.deleteMany({}).then(res.send("complete delete successful"))
  .catch(err => delError + err);

};




// .get(function (req, res,next){

//   const findBookById = (done) => {
//     Book.findById({_id:req.params.id}).select({title:1, comments:1}).exec(function(err,data){
//       if (err) return res.send("no book exists")
//       done(null, data);
//     })
    
//   }      

//   findBookById(function(err,data){
//     if(!data){
//       return res.send("no book exists")
//     }
//       return res.json(data)
//   })


//   //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
// })

// .post(function(req, res,next){
//   let bookid = req.params.id;
//   let comment = req.body.comment;

//   const commentBook = (done) => {
//     Book.findById({_id:bookid}).select({title:1, comments:1, commentcount:1}).exec(function(err,data){
//       if(err||!data)return res.send("no book exists");
//       data.comments.push(comment)
//       data.commentcount+=1
//       data.save(function(err, dataUpd){
//         if(err)return console.error(err);
//         done(null, dataUpd)
//         })
//     })
//   }      
  

//   if(comment==""||comment == undefined){
//     return res.send("missing required field comment")
//   }else{
//     commentBook(function(err,data){
//       if(data==undefined){
//         return res.send("no book exists")
//       }
//       return res.json({_id: data["_id"], title : data.title, comments: data.comments})
//     });
//   }
  
//   //json res format same as .get
  

  
// })

// .delete(function(req, res, next){
//   const bookid = req.params.id;
//   //if successful response will be 'delete successful'

//   const deleteBook = (done) => {
//     Book.findByIdAndRemove({_id:req.params.id}, function(err,data){
//       if(err|!data){
//         return res.send("no book exists")
//       };
//       done(null, data)
//     })
//   }
//   deleteBook(function(err,data){
//     return res.send('delete successful')
//   });
// }

