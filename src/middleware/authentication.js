const passport = require("passport");
const passportJwt = require("passport-jwt");
const fs = require("fs");
const path = require("path");
const User = require("../user/model");

const publicKey = fs.readFileSync(
  path.join(__dirname, "../keys/jwtRS256.key.pub")
);
const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey
};

passport.use(
  new passportJwt.Strategy(jwtOptions, (payload, done) => {
    console.log(payload);
    
    User.findById(payload._doc._id)
      .then(user => {
        console.log(user);
        
        if (user) return done(null, user);
        else console.log("new user");
      })
      .catch(err => {
        return done(err, false);
      });
  })
);

module.exports = passport;
