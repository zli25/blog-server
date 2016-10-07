var router = require('express').Router();
var controller = require('./userController');
var auth = require('../../auth/auth');
var checkUser = [auth.verifyToken(), auth.getFreshUser()]

router.param('id', controller.params);

router.route('/')
  .get(controller.getAll)
  .post(controller.createUser);

router.get('/me', checkUser, controller.me);

router.route('/:id')
  .get(controller.getOne)
  .put(checkUser, controller.updateUser)
  .delete(checkUser, controller.deleteUser)

module.exports = router;