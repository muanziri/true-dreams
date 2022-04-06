const passport3=require('passport');

const usersClients=require('../models/usersClients')
//require('dotenv').config();

var TwitterStrategy = require( 'passport-twitter' ).Strategy;

passport3.serializeUser((user1 ,done)=>{
 
   done(null,user1.id);
   

})
passport3.deserializeUser((id,done)=>{
  
  usersClients.findById(id).then((user)=>{
    
    done(null,user);
  })
  
})





var TWITTER_CLIENT_ID=process.env.TWITTERSEC3
var TWITTER_CLIENT_SECRET=process.env.TWITTERSEC4
passport3.use(new TwitterStrategy({
  consumerKey:     TWITTER_CLIENT_ID,
  consumerSecret: TWITTER_CLIENT_SECRET,
    callbackURL: "https://true-dreams.herokuapp.com/auth/twitter/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
         
    usersClients.findOne({twitterid:profile.id}).then((currentUser)=>{
    
      if(currentUser){
         done(null,currentUser);
      }else{
        new usersClients({
          userName:profile.displayName,
          Email:profile.email,
          googleid:profile.id,
          Profilephoto:profile.picture
        }).save().then((user1)=>{
          done(null,user1)
        })
      } 
  
    })

  
  }
));













