const express = require('express');
const router = express.Router();
// const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
// app.use(morgan('common'));





// adding some sample blog posts
// so there's some data to look at
BlogPosts.create('The Fox', 'The quick brown fox jumps over a lazy dog.', 'Riley Mann', '07.18.2018');
BlogPosts.create('Wizards', 'The five boxing wizards jump quickly.', 'Peter Piper', '06.26.2018');
BlogPosts.create('Jack and the Girls', 'Jack amazed a few girls by dropping the antique onyx vase!', 'J. R. R. Tolkien', '05.21.2018');






// when the root of this router is called with GET,
// return all current blog posts 
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

// ensure all required fields are met
app.post('/blog-posts', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});


// when DELETE request comes in with an id,
// delete that blog post from BlogPosts
app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});


// when PUT request comes in with an id, this ensures that it has
// all of the required fields. also that the blog post id in url path 
// and the updated blog post id match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.update` with updated item.
app.put('/blog-posts/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate']; 
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});


