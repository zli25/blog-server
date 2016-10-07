var router = require('express').Router();
var verifyUser = require('./auth').verifyUser;
var revokeToken = require('./auth').revokeToken;
var controller = require('./controller');
// var User = require('../user/userModel');
var createUser = require('../api/user/userController').createUser;

router.post('/signin', verifyUser(), controller.signin);
router.get('/signout', revokeToken(), controller.signout);
router.post('/signup', createUser);
// router.post('/forgetPwd')

module.exports = router;