

const mongoose=require('mongoose');


const shortUrlSchema=new mongoose.Schema({

    ChannelUrl:{
        type:String,
        required:true,
    },
    ChannelName:{
        type:String,
        required:true,
    },
    Discription:{
      type:String,
      required:true  
    }, 
  idForBuyer:{
    type:String,
    required:true  
  }
});

module.exports=mongoose.model('subscribe',shortUrlSchema);