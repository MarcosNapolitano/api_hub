import mongoose from 'mongoose';

//strings for error handling
const saveError = "Could not save User in database\n\n"
const findError = "Could not find User in database\n\n"

//user model
const userSchema = new mongoose.Schema({

  username: { type: String, required: true },
  exercises: [{
    description: { type: String, required: true },
    duration: { type: String, required: true },
    date: String    
  }],
  
},{versionKey: false});//prevents the __v field, it is usefull but not in this case 
  
const User = mongoose.model("User", userSchema);
  
export const createUser = async (user, res) => {

  //creates user
  const newUser = new User({username:user})

  //saves
  //responds with str repres of user_id
  const result = await newUser.save().catch(err=>console.error(saveError + err))
  
  if(result) return res.json({username: result.username, _id: result._id.toString()})
  else return console.error(saveError)
  
};

export const findUsers = async (res) => {
 
  //find and display all users
  return res.json(await User.find({}).catch(err => console.error(findError + err)));
}

export const createExercise = (req, res) => {

  //stores info submitted by user and checks for correct date
  const id = req.params.id || req.body[':_id'];
  const desc = req.body.description;
  const dur = parseInt(req.body.duration);
  const date = req.body.date ? 
               new Date(req.body.date).toDateString() : new Date(Date.now()).toDateString();
  
  if(date=='Invalid Date') return res.json({error : 'Invalid Date'});

  const saveExercise = async(id,desc,dur,date) => {

    //finds username with the id provided
    await User.findById({_id : id}).sort({username:1}).then(function(data){
  
      //creates new exercise and saves it
      data.exercises.push({description : desc, duration : dur, date : date})
      data.save().catch(err => console.error(saveError + err))

      //returns specified info
      return res.json({username:data.username, description: desc, 
                       duration: dur, date: date, _id: id})

    }).catch(err => console.error(findError + err))
  }

  saveExercise(id,desc,dur,date);
};

export const getLogs= async (req, res)=>{

  //stores variables and sets default values
  const from = req.query.from ? new Date(req.query.from) : new Date('1970-01-01');
  const to = req.query.to ? new Date(req.query.to) : new Date(Date.now());
  const limit = req.query.limit ? parseInt(req.query.limit) : 99;


  //filters the array returned by the query
  await User.findById({_id : req.params.id}).sort({username:1}).then(function(data){

    const filteredList = 

    data.exercises
    .filter(a => Date.parse(a.date)>=from && Date.parse(a.date)<=to)
    .map(a =>({description: a.description, duration: parseInt(a.duration), date: a.date}))

    return res.json({username: data.username , count: data.exercises.length, 
                     _id: data._id, log: filteredList.slice(0,limit)})

  }).catch(err => console.error(findError + err));
    
}