
const buyerClient=require('../models/buyerClient');
const passport=require('passport')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTSecret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload)
    buyerClient.findOne({id: jwt_payload.id}).then((user)=>{
    
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
    
    });
}));