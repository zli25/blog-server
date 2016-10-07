var signToken = require('./auth').signToken;

exports.signin = function(req, res, next) {
  // req.user will be set from verifyUser
  var token = signToken(req.user._id);
  var ret = {
    id: req.user._id,
    token: token
  };
  res.json(ret);
}

exports.signout = function(req, res, next) {
  res.status(200).send("Logout success!");
}