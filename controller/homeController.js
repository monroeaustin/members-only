const bcrypt = require('bcryptjs');
const db = require('../db/queries');
const { validationResult } = require('express-validator');

// BASIC PAGES
function showHomePage(req, res) {
  res.render('home', { user: req.user || null });
}

function showSignUp(req, res) {
  res.render('sign-up', { user: req.user || null });
}

function showLogin(req, res) {
  res.render('login', { user: req.user || null });
}

function showNewMessages(req, res) {
  res.render('newmessage', { user: req.user || null });
}

function showAccess(req, res) {
  if (req.user?.is_admin) return res.redirect('/profile');
  res.render('admin', { user: req.user || null, error: null });
}

function showProfle(req, res) {
  res.render('profile', { user: req.user });
}

// SIGNUP
async function processSignUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render('sign-up-error', { errors: errors.array(), old: req.body, user: null });
  }

  const userInfo = {
    firstName: req.body.FirstName,
    lastName:  req.body.LastName,
    username:  req.body.username
  };
  const hashpw = await bcrypt.hash(req.body.password, 10);

  try {
    await db.signUpUser({ userInfo }, hashpw);
    return res.redirect('/login');
  } catch (err) {
    console.error('Unable to SignUp', err);
    return res.status(500).send('Server error.');
  }
}

// MESSAGES
async function showMessages(req, res) {
  const messages = await db.getAllMessages();
  res.render('messages', { user: req.user || null, messages });
}

async function createMessage(req, res) {
  if (!req.user) return res.redirect('/login');
  const { subject, body } = req.body;
  await db.createMessage({ userId: req.user.id, subject, body });
  res.redirect('/messages');
}

async function deleteMessage(req, res) {
  if (!req.user) return res.redirect('/login');
  await db.deleteMessage(req.user.id, req.params.id);
  res.redirect('/messages');
}

// ADMIN UNLOCK
async function unlockAdmin(req, res) {
  if (!req.user) return res.redirect('/login');
  const passphrase = (req.body?.captcha || '').trim();
  const correct = 'emanym';

  if (passphrase !== correct) {
    return res.status(403).render('admin', { user: req.user, error: 'Incorrect passphrase' });
  }

  await db.grantAdminAccess(req.user.id);
  req.user.is_admin = true; // reflect in current session immediately
  return res.redirect('/profile');
}

module.exports = {
  showHomePage,
  showSignUp,
  showLogin,
  showMessages,
  showAccess,
  showNewMessages,
  showProfle,
  processSignUp,
  unlockAdmin,
  createMessage,
  deleteMessage,
};
