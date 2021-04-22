const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("../config/");
const User = require("../services/user.service");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: false,
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.data.type != "access") {
      return done(null, false);
    }
    const user = await User.getUserById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
