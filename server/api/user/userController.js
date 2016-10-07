var User = require('./userModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken;

exports.params = function(req, res, next, id) {
  User.findById(id)
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        next(new Error('No user with this id ' + id));
      } else {
        req.user = user;
        next();
      }
    }, function(err) {
      next(err);
    });
}

exports.getAll = function(req, res, next) {
  User.find({})
    .select('-password')
    .exec()
    .then(function(users) {
      res.json(users.map(function(user) {
        return user.toJson();
      }))
    }, function(err) {
      return next(err);
    })
}

exports.getOne = function(req, res, next) {
  var user = req.user.toJson();
  res.json(user);
}

exports.createUser = function(req, res, next) {
  var newUser = new User(req.body);

  newUser.save(function(err, user) {
    if (err) {
      return next(err);
    }
    var token = signToken(user._id);
    var ret = {
      id: user._id,
      token: token
    };
    res.json(ret);
  });
};

exports.updateUser = function(req, res, next) {
  var user = req.user;
  var update = req.body;
  _.merge(user, update);
  user.save(function(err, user) {
    if (err) {
      return next(err);
    } else {
      res.json(user.toJson());
    }
  });
};

exports.deleteUser = function(req, res, next) {
  var user = req.user;
  user.remove(function(err, removed) {
    if (err) {
      return next(err);
    } else {
      return res.json(removed.toJson());
    }
  });
};

exports.me = function(req, res, next) {
  res.json(req.user.toJson());
}
