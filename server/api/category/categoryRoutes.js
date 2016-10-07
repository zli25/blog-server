var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./categoryController');
var auth = require('../../auth/auth');

var checkUser = [auth.verifyToken(), auth.getFreshUser()];
// setup boilerplate route jsut to satisfy a request
// for building
router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(checkUser, controller.create)

router.route('/:id')
  .get(controller.getOne)
  .put(checkUser, controller.update)
  .delete(checkUser, controller.delete)

module.exports = router;

