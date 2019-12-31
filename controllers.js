var urlModel =require("./db.js")

 const findUrl=original_url=>new Promise((resolve,reject)=>{  
  
  urlModel.find({original_url}).exec((err,doc)=>{
    if(err)reject(err)
    if(doc)resolve(doc)
  })
})

 const findShortUrl=short_url=>new Promise((resolve,reject)=>{  
  
  urlModel.find({short_url}).exec((err,doc)=>{
    if(err)reject(err)
    if(doc)resolve(doc)
  })
})
 
 const saveUrlCounts=(original_url,count)=>new Promise((resolve,reject)=>{
   
   const document={original_url,short_url:`${count+1}`}
   console.log('document saving',document)
   
     let newShortUrl = new urlModel(document);
      console.log('newShortUrl saving',newShortUrl)

   newShortUrl.save((err,newDoc)=>{
          if(err)reject(err);
     console.log('saed newDoc',newDoc)
          resolve(document);          
        })   
 })
 
 const countUrl=()=>new Promise((resolve,reject)=>{
   urlModel.find({}).countDocuments((err,count)=>{
     
     console.log("urlModel.find",err,count)
     
      if(err){
        console.log('count err',err)
        reject(err);
      }
       resolve(count);
   })   
 })

module.exports ={findUrl,findShortUrl,saveUrlCounts,countUrl};