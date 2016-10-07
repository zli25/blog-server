var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  date: { 
    type: Date, 
    default: Date.now 
  },

  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },

  categories: [{
    name: {
      type: String,
      required: true,
    }
  }],

  isPrivate: {
    type: Boolean,
    default: false, 
  },

  // visibleTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
  // categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}]
});


module.exports = mongoose.model('Post', PostSchema);