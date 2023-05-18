//user model
const userSchema = new mongoose.Schema({

    username: { type: String, required: true },
    exercises: [{
      description: { type: String, required: true },
      duration: { type: String, required: true },
      date: String    
    }]
  });
  
  const User = mongoose.model("User", userSchema);
  
  
  app.post('/api/users',function(req, res, next){
    //stores username 
    const username = req.body.username
    
    const createUser = (user,done) =>{
      //creates user
      const newUser = new User({username:user})
      //responds with str repres of user_id
      res.json({username: username, _id: newUser._id.toString()})
  
      //saves
      newUser.save(function(err, data){
        if (err) return console.log(err);
        done(null, data);
      });
   
    };
    createUser(username,next)
  });
  
  app.get('/api/users',function(req, res, next){
  
    //find and display all users
    User.find({},function (err, data) {
      res.json(data)
      if (err) return console.log(err);
      next(null, data);
      
    });
  })
  
  app.post('/api/users/:id/exercises', function(req,res,next){
  
    //stores info submitted by user and checks for correct date
    const id = req.params.id || req.body[':_id'];
    const desc = req.body.description;
    const dur = parseInt(req.body.duration);
    let date = ''
    if(!req.body.date){
      date = new Date(Date.now()).toDateString()
    }else{
      date = new Date(req.body.date).toDateString()
      if(date=='Invalid Date')
      return res.json({error : 'Invalid Date'})
    }
    
  
    const createExercise = (id,desc,dur,date,done) => {
      //finds username with the id provided
      User.findById({_id : id}).select({__v:0}).sort({username:1}).exec(function(err,data){
    
        //creates new exercise and saves it
        const newExercise = {description : desc, duration : dur, date : date}
        data.exercises.push(newExercise)
        data.save()
        //returns specified info
        res.json({username:data.username, description: newExercise.description, duration: newExercise.duration, 
                  date: newExercise.date, _id: data._id})
        if (err) return console.log(err);
        done(null, data);
      })
    }
    createExercise(id,desc,dur,date,next);
  })
  
  
  app.get('/api/users/:id/logs',function(req, res, next){
  
    //stores variables and sets default values
    let from = req.query.from
    let to = req.query.to
    let limit = parseInt(req.query.limit)
    
    if(!from){
      from = new Date('1970-01-01')
    }else{
      from = new Date(req.query.from)
    }
    if(!to){
      to = new Date(Date.now())
    }else{
      to = new Date(req.query.to)
    }
    if(!limit){
      limit=99
    }
  
    //filters the array returned by the query
    User.findById({_id : req.params.id}).select({__v:0}).sort({username:1}).exec(function(err,data){
  
      const filteredList = data.exercises.filter(a =>Date.parse(a.date)>=from && Date.parse(a.date)<=to).map(a =>(
        {description: a.description, duration:parseInt(a.duration), date:a.date }
      ))
      res.json({username : data.username , count : data.exercises.length, _id: data._id, log:filteredList.slice(0,limit)})
    })
    
})