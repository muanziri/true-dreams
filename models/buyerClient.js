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
    link1:{
        type:String,
        default:'no link'
    },
    link2:{
        type:String,
        default:'no link'
    },
    link3:{
        type:String,
        default:'no link'
    },
    link4:{
        type:String,
        default:'no link'
    },
    link5:{
        type:String,
        default:'no link'
    },
    link6:{
        type:String,
        default:'no link'
    },
    link7:{
        type:String,
        default:'no link'
    },
    link8:{
        type:String,
        default:'no link'
    },
    link9:{
        type:String,
        default:'no link'
    },
    link10:{
        type:String,
        default:'no link'
    },
    link11:{
        type:String,
        default:'no link'
    },
    link12:{
        type:String,
        default:'no link'
    },
    link13:{
        type:String,
        default:'no link'
    },
    link14:{
        type:String,
        default:'no link'
    },
    link15:{
        type:String,
        default:'no link'
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
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports=mongoose.model('buyerClient',UserSchema);