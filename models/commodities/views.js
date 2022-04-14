

const mongoose=require('mongoose');


const shortUrlSchema=new mongoose.Schema({

   Url:{
    type:String,
    required:true,
    },
    videoId:{
        type:String,
        required:true,
    },
    idForBuyer:{
    type:String,
    required:true  
  }
});

module.exports=mongoose.model('views',shortUrlSchema);