const express = require('express');
const session = require('express-session');
const path = require('node:path');
const MainRoute = require('./routes/mainroute');
const passport = require('./config/passport'); 

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true } 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null;     
  res.locals.isAuth = !!req.user;         
  next();
});
app.use('/', MainRoute);

app.listen(3000, () => {
  console.log('APP LIVE');
});
