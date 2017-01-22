const mongoose = require('mongoose');
//const uuid = require('uuid');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: false},
  author: {type: String, required: false},
  publishDate: {type: Date, required: false}
});

blogPostSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.author,
		publishDate: this.publishDate
	};
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = {BlogPost};