var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/users', require('./user/userRoutes'));
router.use('/posts', require('./post/postRoutes'));
router.use('/categories', require('./category/categoryRoutes'));

module.exports = router;