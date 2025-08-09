const express = require('express');
router = express.Router();
const controller = require('../controller/homeController');

router.get('/', controller.showHomePage);
router.get('/signup', controller.showSignUp);
router.get('/login', controller.showLogin);
router.get('/messages', controller.showMessages);
router.get('/messages/new', controller.showNewMessages);
 //router.post('/messages/new', controller.showMessages);
 router.get('/profile', controller.showProfle);


router.get('/access', controller.showAccess)



    module.exports = router;