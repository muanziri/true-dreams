

const mongoose=require('mongoose');


const shortUrlSchema=new mongoose.Schema({

    videoId:{
        type:String,
        required:true,
    },
    idForBuyer:{
    type:String,
    required:true  
  }
});

module.exports=mongoose.model('watchtime',shortUrlSchema);