'use strict';

var express = require('express');
var mongo = require('mongodb');
var urlModel =require("./db.js")
var bodyParser=require('body-parser')
var dns = require("dns")

const {findUrl,saveUrlCounts,countUrl,findShortUrl}=require('./controllers')

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({extended: 'true'}));
app.use(bodyParser.json());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

const sendError=(res)=>{
   res.json({error:"invalid URL"})
}
app.post("/api/shorturl/new/",(req,res)=>{
  
  const {original_url}=req.body
  const uriRegex=/^https?:\/\/(www\.)?\w+\.(com)?(org)?(?=\/\w+)|^https?:\/\/(www\.)?\w+\.(com)?(org)?$/
  const urlFormatIsCorrect=uriRegex.test(original_url)  
  console.log('urlFormatIsCorrect',urlFormatIsCorrect)
  console.log('original_url',original_url)
  
  const original_url_domain=original_url.match(/^https?:\/\/[\w-]+\.(\w+.\w+)/)
  console.log('original_url_domain',original_url_domain)
  
  
  if(urlFormatIsCorrect){ 
  
   dns.lookup(original_url_domain[1], (err,ip)=>{
   if(err){       
    sendError(res)
     return
   }
          
    const _findUrlAssign=async(original_url)=>{
      try{
        const urlRes=await findUrl(original_url);        
        console.log('urlRes',urlRes)
        if(urlRes.length > 0){
           console.log('urlRes.length',urlRes.length)
          const {original_url,short_url}=urlRes[0]
          res.json({original_url,short_url})
          return
        }
        
        const count=await countUrl();
                console.log('count',count)

        const saveUrlRes=await saveUrlCounts(original_url,count )
        console.log('saveUrlRes',saveUrlRes)
        const {short_url}=saveUrlRes
        res.json({original_url:saveUrlRes.original_url,short_url})
        
        
      }catch(err){
        sendError(res)
      }
    }
    _findUrlAssign(original_url)
       
   }) 
   return
  }
 
sendError(res)

  
})


app.get("/api/shorturl/:short_url",(req,res)=>{
  const {short_url}=req.params;
  
  const _findShortUrl=async()=>{
try{
  const findShortUrlRes=await findShortUrl(short_url);
if(findShortUrlRes.length >0){
  console.log("findShortUrlRes",findShortUrlRes)
  res.redirect(findShortUrlRes[0].original_url)
  return
}
  
  sendError(res)
  
}catch(error){
  sendError(res)
}    
  }
  _findShortUrl()
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});