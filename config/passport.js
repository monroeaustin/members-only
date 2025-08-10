
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // match your controller's lib
const db = require('../db/queries'); // will add findByUsername/findById

passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await db.findByUsername(username);
      if (!user) return done(null, false, { message: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return done(null, false, { message: 'Invalid credentials' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findById(id);
    done(null, user || false);
  } catch (e) {
    done(e);
  }
});

module.exports = passport;
