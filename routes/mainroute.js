const express = require('express');
const router = express.Router();
const controller = require('../controller/homeController');
const { check } = require('express-validator');
const passport = require('../config/passport');

// auth guard
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.redirect('/login');
}

// HOME + AUTH
router.get('/', controller.showHomePage);
router.get('/signup', controller.showSignUp);
router.post('/signup', [
  check('username')
    .exists().withMessage('Username is required')
    .isLength({ min: 5 }).withMessage('Username must be 5+ characters'),
  check('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be 8+ characters')
    .not().matches(/\s/).withMessage('Password cannot contain spaces'),
  check('FirstName').trim().notEmpty().withMessage('First name is required'),
  check('LastName').trim().notEmpty().withMessage('Last name is required'),
  check('ConfirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match, please try again.');
    return true;
  })
], controller.processSignUp);

router.get('/login', controller.showLogin);
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login?error=1',
    failureMessage: true,
  })
);

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/'));
  });
});

// PROFILE / ACCESS
router.get('/profile', ensureAuth, controller.showProfle);
router.get('/access', ensureAuth, controller.showAccess);
router.post('/admin/unlock', ensureAuth, controller.unlockAdmin);

// MESSAGES
router.get('/messages', controller.showMessages);
router.get('/messages/new', ensureAuth, controller.showNewMessages);
router.post('/messages/new', ensureAuth, controller.createMessage);
router.post('/messages/:id/delete', ensureAuth, controller.deleteMessage);

module.exports = router;
