const Express=require('express');
const passport=require('passport')
const bcrypt=require('bcrypt')
const router=Express.Router();
const userClient=require('../models/usersClients');
const buyerClient=require('../models/buyerClient')
const Views=require('../models/commodities/views')
const watchtime=require('../models/commodities/watchtime');
const subscribe=require('../models/commodities/subscribe');
var jwt = require('jsonwebtoken');
//const {user}=require('./passport-local');


require('./ath-cleints');

require('./ath-cleints-facebook');
require('./ath-cleintstwitter');
require('./passport-jwt');






router.get('/login',(req,res)=>{
    res.render('login');

})
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook',
   { successRedirect: '/auth/google/success',
     failureRedirect: '/auth/google/failure' }));
router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));
router.get('/auth/twitter',
  passport.authenticate('twitter', { scope:
      [ 'email', 'profile' ] }
));
router.get( '/auth/twitter/callback',
    passport.authenticate( 'twitter', {
        successRedirect: '/auth/twitter/success',
        failureRedirect: '/auth/twitter/failure'
}));



const check=(req,res,next)=>{
    if (!req.user) {
        
        res.redirect('/login')

        
    } else {
        next(); 
    }
}

const check2=(req,res,next)=>{
        
  
        if (!req.user ) {
        
            res.redirect('/buyerLogin')
        
            
        } else {
            console.log(user)
            next();
          
        }
    
  
}



router.get('/auth/google/success',(req,res)=>{
    res.redirect('/seller');

})

router.get('/auth/google/failure',(req,res)=>{
    res.redirect('/login');

})
router.get('/auth/twitter/success',(req,res)=>{
    res.redirect('/seller');

})

router.get('/auth/twitter/failure',(req,res)=>{
    res.redirect('/login');

})


router.get('/',(req,res)=>{
      
    res.render('landingPage');

})



router.get('/seller',check,(req,res)=>{
    let user1= req.user.googleid;
    userClient.findOne({googleid:user1}).then((results)=>{
        Views.find().then((results2)=>{
            watchtime.find().then((results3)=>{
                subscribe.find().then((results4)=>{
                    res.render('seller',{userClient:results,views:results2,watchtime:results3,subscribe:results4});
                })
               
            })
            
        })
        
    })

})

router.post('/update/:id', async (req,res)=>{
    let ID=req.params.id;
    let viewsCount=req.body.videoId.trim();

    

    const USERCLIENT= await userClient.findOne({_id:ID})
      Views.findOne({_id:viewsCount}).then((results)=>{   
        
       let myquery={id:ID};
       let watchtimeQuery=results.id;
       let newPOINTS= USERCLIENT.points+1;
       let WATCHTIMEPoints=results.views+1;
        
    
      let query={points:newPOINTS}
      Views.updateOne({_id:watchtimeQuery},{views:WATCHTIMEPoints},(err,ress)=>{
        if (err)throw err
        
    })
         
       userClient.updateOne(myquery,query,(err,ress)=>{
           if (err)throw err
           
          res.redirect('/seller')
       
    })
       })
     
    

})

router.post('/updateWatchtime/:id', async (req,res)=>{
    let ID=req.params.id;
    let viewsCount=req.body.videoId.trim();

    

    const USERCLIENT= await userClient.findOne({_id:ID})
      watchtime.findOne({_id:viewsCount}).then((results)=>{   
        
       let myquery={id:ID};
       let watchtimeQuery=results.id;
       let newPOINTS= USERCLIENT.points+1;
       let WATCHTIMEPoints=results.views+4;
    
    
      let query={points:newPOINTS}
      watchtime.updateOne({_id:watchtimeQuery},{views:WATCHTIMEPoints},(err,ress)=>{
        if (err)throw err
        
    })
         
       userClient.updateOne(myquery,query,(err,ress)=>{
           if (err)throw err
           
          res.redirect('/seller')
       
    })
       })
     
    

})


router.get('/buyerLogin',(req,res)=>{
    
    res.render('buyerLogin')
})
router.post('/buyerLogin',(req,res)=>{
    buyerClient.findOne({userName:req.body.userName}).then((user)=>{
     if(!user){
           return res.status(401).send({success:false,message:"this user don't exist please signup"})
        }
    if(!bcrypt.compareSync(req.body.password,user.password)){
        return res.status(401).send({success:false,message:"incorrect password"})
    }   
    })
    const payload={
        userName:user.userName,
        id:user._id
    }
  const token= jwt.sign(payload, process.env.JWTSecret, {expiresIn:"1d"})
    res.status(200).send({success:true,token:"Bearer "+token})
})
router.get('/buyer',passport.authenticate('jwt', { session: false }),(req,res)=>{
    
    res.render('buyer')
})
router.post('/buyerLogin1',async(req,res)=> {
 
  
    try {
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        new buyerClient({
          userName:req.body.userName,  
          Email:req.body.email,
          phoneNumber:req.body.phone,
          password: hashedPassword 
        }).save().then((results)=>{
        res.redirect('/buyerLogin')
      })
    } catch (error) {
        console.log(error)
    }


})

router.get('/index',(req,res)=>{
    
    res.render('index')
})


module.exports=router;