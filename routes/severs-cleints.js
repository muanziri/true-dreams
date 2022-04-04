const Express=require('express');
const passport=require('passport')
const bcrypt=require('bcrypt')
const router=Express.Router();
const userClient=require('../models/usersClients');
const buyerClient=require('../models/buyerClient')
const Views=require('../models/commodities/views')
const watchtime=require('../models/commodities/watchtime');
const subscribe=require('../models/commodities/subscribe');
//const {user}=require('./passport-local');


require('./ath-cleints');
require('./ath-cleints-facebook');
require('./passport-local');





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
router.get('/buyer',check2,(req,res)=>{
    
    res.render('buyer')
})

router.get('/',(req,res)=>{
      
    res.render('landingPage');

})



router.get('/seller',(req,res)=>{
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
router.post('/buyerLogin',passport.authenticate('local',{
       successRedirect:'/buyer',
       failureRedirect:'/buyerLogin',
       failureFlash: true
}))
router.post('/buyerLogin1',async(req,res)=> {
 
  
    try {
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        new buyerClient({
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
router.post('/sendMessage',(req,res)=>{
     
     const message= req.body.message
    
    const accountSid = 'AC75de2e14fed9a457631274f3297f4fd9'; 
    const authToken = '563b3544d51032f26e9bcab9dea6d45d'; 
    const client = require('twilio')(accountSid, authToken); 
     
    client.messages 
          .create({ 
             body: message, 
             from: 'whatsapp:+14155238886',       
             to: 'whatsapp:+250783987223' 
           }) 
            .then((message) => {console.log(message.sid);  res.send('<h1>successfull sent</h1>')}) 
          .done();
   
      
        
})


module.exports=router;