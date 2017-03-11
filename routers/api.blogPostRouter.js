const express = require('express');
const router = express.Router();

const path = require('path');
const bodyParser = require('body-parser');
const json = bodyParser.json();


const {BlogPost} = require('../models/api.blogposts.js');


router.get('/posts', (req, res) => {
  BlogPost
    .find()
    .limit(10)
    .exec()
    .then(blogposts => {
      res.json({
        blogposts: blogposts.map(
          (blogpost) => blogpost.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/posts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .exec()
    .then(blogpost =>res.json(blogpost.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.post('/posts', (req, res) => {
	const requiredFields = ['title', 'content'];
	requiredFields.forEach(field => {
		if (! (field in req.body && re.body[field])) {
			return res.status(400).json({message: `Must specify value for ${field}`});
		}
	}); 
  console.log("CAPTURE FORM DATA:", req.body);
	BlogPost
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			publishDate: req.body.publishDate || Date.now()
		})
		.then(
			blogpost => res.status(201).json(blogpost.apiRepr()))
		.catch(err => {
			console.error(err);
			return res.status(500).json({message: 'Internal server error'});
		});
});

router.put('/posts/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }
//mongoimport --db test-blog --collection blogposts --drop --file ~/code/blog-w-mongoose/seed-data.json --host mongodb://user:password@ds161059.mlab.com:61059/test-blog
//mongoimport --db test-blog --collection blogposts --drop --file ~/code/blog-w-mongoose/seed-data.json --host ds161059.mlab.com:61059/test-blog --port 49577  -u user -p password

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author', 'publishDate'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPost
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(blogpost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/posts/:id', (req, res) => {
  BlogPost
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(blogpost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;