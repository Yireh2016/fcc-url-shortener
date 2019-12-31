const mongoose =  require('mongoose');



mongoose.connect(`mongodb+srv://fcc-mongo-jainer:${process.env.DBPASSWD}@cluster0-8ebwi.mongodb.net/test?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true })


let Schema=mongoose.Schema;

const urlSchema =new Schema({
  original_url:String,
  short_url: String,
})

let Url=mongoose.model('Url',urlSchema)

module.exports=Url