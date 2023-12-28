const User = require('./user');
const Comment = require('./comment');
const Blog = require('./blog');

Blog.belongsTo(User);
User.hasMany(Blog);

Comment.belongsTo(Blog);
Blog.hasMany(Comment);


module.exports = { User, Blog, Comment };