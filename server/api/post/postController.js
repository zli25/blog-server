var _ = require('lodash');
var Post = require('./postModel');
var Category = require('../category/categoryModel');
var User = require('../user/userModel');

exports.params = function(req, res, next, id) {
  Post.findById(id)
    .populate('author', 'username')
    .select('-isPrivate')
    .exec()
    .then(function(post) {
      if (!post) {
        next(new Error('No post with id ' + id));
      } else {
        req.post = post;
        next();
      }
    }, function(err) {
      next(err);
    });
};

exports.getOne = function(req, res, next) {
  var post = req.post;
  res.json(post);
};

exports.getAll = function(req, res, next) {
  Post.find({author: req.user._id})
    .populate('author', 'username')
    .select('-isPrivate')
    .exec()
    .then(function(posts) {
      res.json(posts);
    }, function(err) {
      next(err);
    })
};

exports.getAllPublicPosts = function(req, res, next) {
  Post.find({isPrivate: false})
    .populate('author', 'username')
    .select('-isPrivate')
    .exec()
    .then(function(posts) {
      res.json(posts);
    }, function(err) {
      next(err);
    })
}

exports.getUserPosts = function(req, res, next) {
  User.findById(req.params.userid)
    .then(function(targetUser) {
      if (!targetUser) {
        return next(new Error('user does\'t exist.'));
      }
      Post.find({author: targetUser._id, isPrivate: false})
        .populate('author', 'username')
        .select('-isPrivate')
        .exec()
        .then(function(posts) {
          res.json(posts);
        }, function(err) {
          next(err);
        });
    }, function(err) {
      next(err);
    })
}

exports.create = function(req, res, next) {
  var newPost = new Post(req.body);
  newPost.author = req.user._id;
  newPost.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      saved.categories.forEach(function(category) {
        Category.find({name: category.name})
          .then(function(ret) {
            if (!ret) {
              var newCategory = {
                name: category.name,
                _id: category._id
              }
              // Create new category entry
              Category.create(newCategory)
                .then(function() {
                  res.json(saved);
                }, function(err) {
                  next(err);
                });
            } else {
              res.json(saved);
            }
          }, function(err) {
            next(err);
          });
      });
    };
  })
};

exports.update = function(req, res, next) {
  var post = req.post;
  var update = req.body;
  _.merge(post, update);
  post.save(function(err, updated) {
    if (err) {
      next(err);
    } else {
      res.json(updated);
    }
  })
}

exports.delete = function(req, res, next) {
  req.post.remove(function(err, deleted) {
    if (err) {
      next(err)
    } else {
      res.json(deleted);
    }
  })
}

