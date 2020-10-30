// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// define the book model
let BooksModel = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  BooksModel.find({}, (error, books) => {
    if (error) {
      return res.render('errors/500', {
        title: 'Error : Book List',
        error: error || 'Book listing error'
      });
    }
    else {
      return res.render('books/index', {
        title: 'Books', books: books
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  // Render books detail page
  const books = {};
  return res.render('books/details', {
    title: 'Book Add',
    mode: 'add',
    books: books
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  const { title, description, price, author, genre } = req.body;

  // Creating book object
  const book = {
    Title: title,
    Description: description,
    Price: price,
    Author: author,
    Genre: genre
  };

  // Save book data in db
  BooksModel.create(book, (error, hero) => {
    if (error) {
      return res.render('errors/500', {
        title: 'Error : Book Create',
        error: error
      });
    }
    return res.redirect('/books');
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  const _id = req.params.id;

  // Validating the _id
  if (mongoose.Types.ObjectId.isValid(_id)) {
    // Find book by ID
    BooksModel.findById(_id, (error, books) => {
      if (error) {
        return res.render('errors/500', {
          title: 'Error : Book Update',
          error: error
        });
      }
      else {
        return res.render('books/details', {
          title: 'Books Details',
         mode: 'edit',
          books: books
        });
      }
    });
  } else {
    return res.render('errors/500', {
      title: 'Error : Book Update',
      error: "_id is not valid"
    });
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', async (req, res, next) => {
  const id = req.params.id;
  const { title, description, price, author, genre } = req.body;

  // Creating book object
  const book = {
    Title: title,
    Description: description,
    Price: price,
    Author: author,
    Genre: genre
  };

  // Validating the _id
  if (mongoose.Types.ObjectId.isValid(id)) {
    // find book by id and update
    BooksModel.findOneAndUpdate({ _id: id }, { $set: book }).then((docs) => {
      if (docs) {
        res.redirect('/books');
      } else {
        return res.render('errors/500', {
          title: 'Error: Book delete',
          error: "Nothing to update"
        });
      }
    }).catch((error) => {
      return res.render('errors/500', {
        title: 'Error: Book delete',
        error: error
      });
    });
  } else {
    return res.render('errors/500', {
      title: 'Error: Book delete',
      error: "_id is not valid"
    });
  }
});

// GET - process the delete by user id
router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;

  // Validating the _id
  if (mongoose.Types.ObjectId.isValid(id)) {
    // Find book by id and update
    BooksModel.findByIdAndDelete({ _id: id })
      .then((docs) => {
        if (docs) {
          res.redirect('/books');
        } else {
          return res.render('errors/500', {
            title: 'Error: Book delete',
            error: 'Book not found'
          });
        }
      }).catch((error) => {
        return res.render('errors/500', {
          title: 'Error: Book delete',
          error: error
        });
      });
  } else {
    return res.render('errors/500', {
      title: 'Error: Book delete',
      error: "_id is not valid"
    });
  }
});

module.exports = router;
