/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';


module.exports = function (app) {
  
  const mongoose = require('mongoose')

  mongoose.connect(process.env.MONGO_URI);

  const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
  commentcount: { type: Number, default: 0 }
  });

  const Book = mongoose.model("Book", bookSchema);

  app.route('/api/books')
    .get(function (req, res, next){
      //response will be array of book objects
      const findAllBooks = (done) => {
        Book.find({}).select({title:1, commentcount:1}).exec(function(err,data){
          if (err) return console.error(err);
          done(null, data)
        })
      }
      
      findAllBooks(function(err,data){
        if(err){
          return next(err)
        }
        if(!data){
          return next(res.send("empty query"))
        }
        return res.json(data)
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res, next){
      
      const title = req.body.title;

      const createAndSaveBook = (done) => {
  
        const newBook = new Book({title: title});
        newBook.save(function (err,data){
          if (err) return console.error(err);
          done(null, data);
        });
      };
      
      if(req.body.title==""||req.body.title==undefined){
        res.send("missing required field title")
        
      }else{
        createAndSaveBook(function(err,data){
          if(err){
            return next(err)
          }
          if(!data){
            return next(res.send("empty query"))
          }
          return res.json({title: data.title, _id: data.id})
        });
      }
      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res, next){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({})
      return next(res.send("complete delete successful"))
    
    });



  app.route('/api/books/:id')
    .get(function (req, res,next){

      const findBookById = (done) => {
        Book.findById({_id:req.params.id}).select({title:1, comments:1}).exec(function(err,data){
          if (err) return res.send("no book exists")
          done(null, data);
        })
        
      }      

      findBookById(function(err,data){
        if(!data){
          return res.send("no book exists")
        }
         return res.json(data)
      })
    

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res,next){
      let bookid = req.params.id;
      let comment = req.body.comment;

      const commentBook = (done) => {
        Book.findById({_id:bookid}).select({title:1, comments:1, commentcount:1}).exec(function(err,data){
          if(err||!data)return res.send("no book exists");
          data.comments.push(comment)
          data.commentcount+=1
          data.save(function(err, dataUpd){
            if(err)return console.error(err);
            done(null, dataUpd)
           })
        })
      }      
      

      if(comment==""||comment == undefined){
        return res.send("missing required field comment")
      }else{
        commentBook(function(err,data){
          if(data==undefined){
            return res.send("no book exists")
          }
          return res.json({_id: data["_id"], title : data.title, comments: data.comments})
        });
      }
      
      //json res format same as .get
      

      
    })
    
    .delete(function(req, res, next){
      const bookid = req.params.id;
      //if successful response will be 'delete successful'

      const deleteBook = (done) => {
        Book.findByIdAndRemove({_id:req.params.id}, function(err,data){
          if(err|!data){
            return res.send("no book exists")
          };
          done(null, data)
        })
      }
      deleteBook(function(err,data){
        return res.send('delete successful')
      });
   
    });
};
