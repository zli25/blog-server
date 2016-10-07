var router = require('express').Router();
var controller = require('./postController');
var auth = require('../../auth/auth');

var checkUser = [auth.verifyToken(), auth.getFreshUser()];

router.param('id', controller.params);

router.route('/all')
  .get(controller.getAllPublicPosts)

router.route('/:id')
  .get(controller.getOne)
  .put(checkUser, controller.update)
  .delete(checkUser, controller.delete);

router.route('/')
  .get(checkUser, controller.getAll)
  .post(checkUser, controller.create);

router.route('/user/:userid')
  .get(checkUser, controller.getUserPosts);

module.exports = router;