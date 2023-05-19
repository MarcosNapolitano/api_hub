'use strict';


//create Issues class with "project" as default project and ID 0
class Issues{

  constructor() {
    this.projects = {project : []}
    this.id = -1 //so it starts on 0 on first push 
  }
  
  getIssues(req, res){
  
    //filters for project name
    const issues = this.projects[req.params.project];
    const correctParams = ["_id", "issue_title", "issue_text", "created_on", "updated_on", 
                           "created_by", "assigned_to", "open", "status_text"]

    //if project does not exists, creates a new one
    if(!issues){
      this.projects[req.params.project]=[]
      issues = this.projects[req.params.project]
    }
    //makes a boolean out of the query string
    req.query.open ? req.query.open==true : req.query.open==false

    //filters out params not included in the "issue" object. 
    //If the parameter exists, the project is then filtered.
    //a map here would be better to prevent the exponential time
    for (let i in req.query){
      if(!correctParams.includes(i)){
        continue;
      }
      issues = issues.filter(a => a[i]==req.query[i])
    }
    
    return res.json(issues)
    
  };  

    
  postIssue(req, res){

    //currently the index template doesn't support creating issues on other projects
    const issues = this.projects[req.params.project];

    //if no project creates a new one
    if(!issues){
      this.projects[req.params.project]=[]
      issues = this.projects[req.params.project];
    }

    //handles missing required fields
    if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
      console.warn('Field(s) missing!')
      return res.json({ error: 'required field(s) missing' })
    }

    //generates, ID, issue and pushes it to the current project
    this.id++

    const query = {_id: this.id.toString(),
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
    created_on: new Date(Date.now()),
    updated_on: new Date(Date.now()),
    created_by: req.body.created_by,
    assigned_to: req.body.assigned_to || "",
    open: true,
    status_text: req.body.status_text || ""}

    issues.push(query)
    
    console.log('Entry succesfully submitted')
    return res.json(query)
        
  };
    
  updateIssue(req, res){
    
    //currently the index template doesn't support updating issues on other projects
    let issues = this.projects[req.params.project];

    //if no id provided
    if(!req.body["_id"]){
      return res.json({ error: 'missing _id' })
    }
    //if only id provided
    if(Object.keys(req.body).length==1 && Object.keys(req.body)[0]=="_id"){
      return res.json({ error: 'no update field(s) sent', '_id': req.body["_id"] })
    }

    //filter issues by id and iterates over body properties, then acts accordingly
    issues = issues.filter(a => a["_id"]==req.body["_id"])

    if(!issues.length){
      return res.json({ error: 'could not update', '_id': req.body["_id"] })
    }

    //now issues is the first "object" of the filtered "array"
    issues = issues[0]

    for(let i in req.body){
      if(i=='open'){
        issues.open = false
      }
      if(req.body[i]==''){
        issues[i]=""
      }else{
        issues[i]=req.body[i]
      }
    }

    //updates "updated_on"
    issues.updated_on = new Date(Date.now())
    console.log('Issue succesfully updated')
  
    return res.json({  result: 'successfully updated', '_id':issues["_id"] })
    
  };
    
  deleteIssue(req, res){

    const issues = this.projects[req.params.project];

    if(!issues){
      return res.json({error : 'missing_project'})
    }

    if(!req.body["_id"]){
      return res.json({ error: 'missing _id' })
    }

    //filter issues by id and deletes it from the original object depending on the index
    const index = issues.indexOf(issues.filter(a => a["_id"]==req.body["_id"])[0])

    if(index==-1){
      return res.json({error: 'could not delete', '_id': req.body["_id"]})
    }

    issues.splice(index,1)

    console.log('Entry succesfully deleted')
    
    return res.json({ result: 'successfully deleted', '_id': req.body["_id"] })

    
  };
    
};


let issue_DB = new Issues()

export default issue_DB