const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
	//open and close server
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

	it('should list BlogPosts on GET', function() {
		return chai.request(app)
			.get('blog-posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);
				const expectedKeys = [
					'id', 
					'title', 
					'content', 
					'author', 
					'publishDate'
				];
				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys(expectedKeys);
				});
			});
	});

	it('should post a BlogPost on POST', function() {
		//data for testing BlogPost
		const newBlogPost = {
			title: 'Test Title',
			content: 'Test Lorem Ipsum',
			author: 'Mocha Tester',
			publishDate: Date.now()
		};

		return chai.request(app)
			.post('/blog-posts')
			.send(newBlogPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys(
						'id', 
						'title', 
						'content', 
						'author', 
						'publishDate'
					);
				res.body.id.should.not.be.null;
				res.body.should.deep.equal(Object.assign(newBlogPost, {id: res.body.id}));
			});
	});

	it('should update items on PUT', function() {
		const updateData = {
			title: 'Updated Test Title',
			content: 'Updated Test Lorem Ipsum',
			author: 'Updated Mocha Tester',
			publishDate: Date.now()
		};

		return chai.request(app)
			.get('blog-posts')
			.then(function(res) {
				updateData.id = res.body[0].id;
				return chai.request(app)
				.put(`/blog-posts/${updateData.id}`)
				.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.deep.equal(updateData);
			});
	});

	it('should delete BlogPost on DELETE', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
			});
	});

});