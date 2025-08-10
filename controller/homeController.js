bcrypt = require('bcryptjs');
db = require('../db/queries');
const { check, validationResult } = require('express-validator');

function showHomePage (req,res) {
    res.render('home');
}

function showSignUp(req,res){
    res.render('sign-up');
}
async function processSignUp(req,res){

      const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('sign-up-error', { errors: errors.array(), old: req.body });
  }

    let userInfo = {
        "firstName":req.body.FirstName,
        "lastName":req.body.LastName,
        "username":req.body.username
    }
 const hashpw = await bcrypt.hash(req.body.password, 10);

 try {
     await db.signUpUser({userInfo},hashpw)
 }
 catch(err){
    console.error('Unable to SignUp', err)
    throw new Error('Error creating user profile.')
 }
res.redirect('/login')
}

function showLogin(req,res){
    res.render('login')
}


async function processLogin(req, res, next) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).render('login-error', { error: 'Username and password are required.' });
    }

    const user = await db.selectUser(username); 

    if (!user) {
      
      return res.status(401).render('login-error', { error: 'Invalid credentials.' });
    }
    console.log(user);
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).render('login-error', { error: 'Invalid credentials.' });
    }


    return res.redirect('/profile');
  } catch (err) {
    console.error('Login error:', err);
    return next(err);
  }
}


function showMessages (req,res) {
    res.render('messages')
}
function showNewMessages (req,res) {
    res.render('newmessage')
}

function showAccess(req,res){
    res.render('admin');
}
function showProfle(req,res){
    res.render('profile');
}


module.exports =  {
    showHomePage,
    showSignUp,
    showLogin,
    showMessages,
    showAccess,
    showNewMessages,
    showProfle,
    processSignUp,
    processLogin
}