cyrpt = require('bcryptjs');
db = require('../db/queries');
function showHomePage (req,res) {
    res.render('home');
}

function showSignUp(req,res){
    res.render('sign-up');
}
async function processSignUp(req,res){
    let user = {
        "firstName":req.body.FirstName,
        "lastName":req.body.LastName,
        "username":req.body.username
    }
 hashpw = await bcrypt.hash(req.body.password, 10);

 try {
     await db.processSignUp(user,hashpw)
 }
 catch(err){
    console.error('Unable to SignUp', err)
    throw new Error('Error creating user profile.')
 }
res.redirct('/login')
}

function showLogin(req,res){
    res.render('login')
}

const bcrypt = require("bcryptjs");

async function processLogin(req, res, next) {
  try {
    const user = await db.selectUser(req.body.username);

    if (!user) {
      return res.redirect("/login?error=UserNotFound");
    }

    const match = await bcrypt.compare(req.body.password, user.password_hash);

    if (!match) {
      return res.redirect("/profile");
    }

   

    res.redirect("/messages");

  } catch (err) {
    console.error("Login error:", err.message);
    next(err);
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
    processSignUp
}