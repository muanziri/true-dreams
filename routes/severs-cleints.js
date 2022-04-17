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
const views = require('../models/commodities/views');


require('./ath-cleints');

require('./ath-cleints-facebook');
require('./ath-cleintstwitter');







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

router.post('/updateViews/:id', async (req,res)=>{
    let ID=req.params.id;
    let whatched=req.body.idForBuyer
    const USERCLIENT= await userClient.findOne({_id:ID}) 
    let myquery={id:ID};
    let newPOINTS= USERCLIENT.points+1;
   let query={points:newPOINTS}
    userClient.updateOne(myquery,query,(err,ress)=>{
        if (err)throw err
       res.redirect('/seller')
 })
     views.findOne({videoId:whatched}).then(async(results)=>{
        const BUYERCLIENT= await buyerClient.findOne({_id:whatched})
        let myquery={id:results.idForBuyer};
        let newViews=BUYERCLIENT.views+1;
        let newWatchtime=BUYERCLIENT.watchtime+1;
        let query={views:newViews,watchtime:newWatchtime}
        buyerClient.updateOne(myquery,query);
     
    })    
      
})

router.post('/updateWatchtime/:id', async (req,res)=>{
    let ID=req.params.id;
    let whatched=req.body.idForBuyer
    const USERCLIENT= await userClient.findOne({_id:ID})   
       let myquery={id:ID};
       let newPOINTS= USERCLIENT.points+3;
      let query={points:newPOINTS}
       userClient.updateOne(myquery,query,(err,ress)=>{
           if (err)throw err
          res.redirect('/seller') 
    })
    views.findOne({videoId:whatched}).then(async(results)=>{
        const BUYERCLIENT= await buyerClient.findOne({_id:whatched})
        let myquery={id:results.idForBuyer};
        let newViews=BUYERCLIENT.views+1;
        let newWatchtime=BUYERCLIENT.watchtime+1;
        let query={views:newViews,watchtime:newWatchtime}
        buyerClient.updateOne(myquery,query);
     
    })  
})

router.post('/updateShares/:id', async (req,res)=>{
    let ID=req.params.id;
    const USERCLIENT= await userClient.findOne({_id:ID})   
       let myquery={id:ID};
       let newPOINTS= USERCLIENT.points+0.5;
      let query={points:newPOINTS}
       userClient.updateOne(myquery,query,(err,ress)=>{
           if (err)throw err
          res.redirect('/seller') 
    })
})

router.post('/newVideo',(req,res)=>{
    let videoUrl=req.body.videoID;
    let videoId=videoUrl.slice(32)
    console.log(videoId);
    new watchtime({
        Url:videoUrl,
        videoId:videoId,
        idForBuyer:req.body.idForBuyer
       
       }).save().then((results)=>{
           buyerClient.updateOne({id:req.body.idForBuyer},{Tlinks:videoId},(err,ress)=>{
                if (err)throw err
           })
           req.flash('error','login to approve your submition')
           res.redirect('/buyerLogin')
           
       })
       new views({
        Url:videoUrl,  
        videoId:videoId,
        idForBuyer:req.body.idForBuyer
       }).save().then((results)=>{
           buyerClient.updateOne({id:req.body.idForBuyer},{},(err,ress)=>{
                if (err)throw err
           })
           
           
       })  
})
router.post('/newChannel',(req,res)=>{
   new subscribe({
    ChannelName:req.body.ChannelName,
    ChannelUrl:req.body.ChannelUrl,
    Discription:req.body.ChannelDiscription,
    idForBuyer:req.body.idForBuyer
   }).save().then((res)=>{
       buyerClient.updateOne({id:req.body.idForBuyer},{ChannelUrl:req.body.ChannelUrl, ChannelName:req.body.ChannelName,Discription:req.body.ChannelDiscription},(err,ress)=>{
            if (err)throw err
       })
       res.send('<h1> sent </h1>')
       
   })
})

router.get('/buyerLogin',(req,res)=>{
    
    res.render('buyerLogin')
})
router.post('/buyerLogin', (req,res)=>{
    buyerClient.findOne({userName:req.body.userName}).then((user)=>{
    const truePassword=  bcrypt.compareSync(req.body.password,user.password)
    const verify= jwt.verify(user.token,process.env.JWTSecret)
     if(user){
     if(truePassword){  
      if(verify) {
       views.find({idForBuyer:user.id}).then((results)=>{
          
        res.render('buyer',{User:user,Links:results})
       }).catch((err)=>{console.log(err)})   
      
      }else{req.flash('error','incorrect password');res.redirect('/buyerLogin')}
    }else{req.flash('error','incorrect password');res.redirect('/buyerLogin')}      
    }else{req.flash('error','this user is invalid');res.redirect('/buyerLogin')}
      
    })
})
router.post('/buyerLogin1',async(req,res)=> {
    const payload={
      userName:req.body.userName,
      password:req.body.password
    }
  const token= jwt.sign(payload, process.env.JWTSecret)
  
    try {
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        new buyerClient({
          userName:req.body.userName,  
          Email:req.body.email,
          phoneNumber:req.body.phone,
          password: hashedPassword,
          token:token 
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