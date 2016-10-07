var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
// var checkToken = expressJwt({ secret: config.secrets.jwt});
var User = require('../api/user/userModel');
var InvalidToken = require('./invalidTokenModel');

exports.verifyToken = function() {

  // expressJwt will return a middleware: function(req, res, next) {};
  // it will call next if token is valid
  // and send error if its not. It will attached
  // the decoded token to req.user
  return expressJwt({ 
    secret: config.secrets.jwt,
    getToken: function (req) {
      if (req.headers.token && req.headers.token.split(' ')[0] === 'Bearer') {
          return req.headers.token.split(' ')[1];
      }
      return null;
    },
    isRevoked: isRevokedCallback
  });
}

exports.revokeToken = function() {
  return function(req, res, next) {
    var doc = new InvalidToken({
      token: req.headers.token.split(' ')[1]
    });
    doc.save(function(err, token) {
      if (err) {
        return next(err);
      }
      next();
    });
  }
}

var isRevokedCallback = function(req, payload, done){
  InvalidToken.find({token: req.headers.token.split(' ')[1]}, function(err, token) {
    if (err) { 
      return done(err); 
    }
    return done(null, token.length !== 0);
  });
};


exports.getFreshUser = function() {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user) {
        if(!user) {
          res.status(401).send('Unauthorized!');
        } else {
          req.user = user;
          next();
        }
      }, function(err) {
        next(err);
      })
  }
}

exports.verifyUser = function() {
  return function(req, res, next) {
    var username = req.body.username;
    var pwd = req.body.password;

    if (!username || !pwd) {
      res.status(400).send('You need a username and password');
      return;
    }

    User.findOne({username: username})
      .then(function(user) {
        if (!user) {
          res.status(401).send('No user found with the given username!');
        } else {
          if (!user.authenticate(pwd)) {
            res.status(401).send('Wrong password!');
          } else {
            // if everything is good,
            // then attach to req.user
            // and call next so the controller
            // can sign a token from the req.user._id
            req.user = user;
            next();
          }
        }
      }, function(err) {
        next(err);
      });
  };
}

// util method to sign tokens on signup
exports.signToken = function(id) {
  return jwt.sign(
    {_id: id},
    config.secrets.jwt,
    {expiresIn: config.expireTime}
  );
}