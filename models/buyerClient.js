const mongoose=require('mongoose');
const schema=mongoose.Schema

const UserSchema=new schema({
  
    Email:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    ChannelName:{
        type:String
        
    },
    Discription:{
        type:String
      
    },
    ChannelUrl:{
        type:String
        
    },
   
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'unpayed'
    },
    links:{
        Tlinks:[String],
        
    },
   
    
    phoneNumber:{
        type:Number,
        required:true,
        default:0
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    subcribes:{
        type:Number,
        required:true,
        default:0
    },
    watchtime:{
        type:Number,
        required:true,
        default:0
    },
    RemainingLinks:{
        type:Number,
        required:true,
        default:0
    },
    RemainingLinksForChannel:{
        type:Number,
        required:true,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports=mongoose.model('buyerClient',UserSchema);