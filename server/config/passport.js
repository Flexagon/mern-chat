const { Strategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
require('dotenv').config();


const secretOrKey = process.env.SECRET_OR_KEY;
const User = mongoose.model('User');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
};

module.exports = (passport) => {
  passport.use(new Strategy(options, (jwtPayload, done) => {
    User
      .findById(jwtPayload.id)
      .then(user => (user ? done(null, user) : done(null, false)))
      .catch(err => console.error(err));
  }));
};
