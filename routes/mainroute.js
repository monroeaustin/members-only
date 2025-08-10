const express = require('express');
router = express.Router();
const controller = require('../controller/homeController');
const { check, validationResult } = require('express-validator');


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
    check('ConfirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match, please try again.');
            }
            return true; 
        })
], controller.processSignUp);

router.get('/login', controller.showLogin);
router.post('/login', controller.processLogin)
router.get('/messages', controller.showMessages);
router.get('/messages/new', controller.showNewMessages);
 //router.post('/messages/new', controller.showMessages);
 router.get('/profile', controller.showProfle);


router.get('/access', controller.showAccess)



    module.exports = router;