export const checkUrl = (url) => {

    //gets url and trims
    const RE = /^https?:\/\//

    //test for URL 
    if(!(RE.test(url))){
      
      return false
    }

    return true
}

let data = new Map()
let actual_id = -1;

export const postUrl = (url, res) => {

    //search in map object
    for (const [key, value] of data.entries()) {

        if (value == url){
            return res.json({url: url, short_url: key});
        }
    }
    
    //if not in database insert
    actual_id++
    data.set(actual_id,url)
  
    return res.json({url: url, short_url: actual_id});

}

export const getUrl = (id, res) => {

    //get id and search if it exists in the list
    const LINK = data.get(parseInt(id));
    //if exists redirect else show err
    if(LINK) {
      return res.redirect(LINK);
    } else {
      return res.json({error: 'url not inserted'});
    }
}

export const last_Id = (res)=>{

  return res.json({last_id:actual_id})
}
