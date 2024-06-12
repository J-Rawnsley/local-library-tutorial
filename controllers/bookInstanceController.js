const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

const asyncHandler = require('express-async-handler');
const { book_detail } = require('./bookController');
const { body, validationResult } = require('express-validator');
const { format } = require('morgan');

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
	const allBookInstances = await BookInstance.find().populate('book').exec();

	res.render('bookinstance_list', {
		title: 'Book Instance List',
		bookinstance_list: allBookInstances,
	});
});

exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
	const bookInstance = await BookInstance.findById(req.params.id)
		.populate('book')
		.exec();

	if (bookInstance === null) {
		const err = new Error('Book copy not found');
		err.status = 404;
		return next(err);
	}

	res.render('bookinstance_detail', {
		title: 'Book:',
		bookInstance: bookInstance,
		book: bookInstance.book,
	});
});

exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
	const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

	res.render('bookinstance_form', {
		title: 'Add Book Instance',
		book_list: allBooks,
	});
});

exports.bookinstance_create_post = [
	body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
	body('imprint', 'Imprint must be at least 3 characters')
		.trim()
		.isLength({ min: 3 })
		.escape(),
	body('status').escape(),
	body('due_back', 'Invalid date')
		.optional({ values: 'falsy' })
		.isISO8601()
		.toDate(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		console.log(req.body);
		console.log(validationResult(req));

		const bookInstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back,
		});

		if (!errors.isEmpty()) {
			console.log('re-redering form...');
			const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

			res.render('bookinstance_form', {
				title: 'Add Book Instance',
				book_list: allBooks,
				selected_book: bookInstance.book._id,
				errors: errors.array(),
				bookinstnce: bookInstance,
			});
			return;
		} else {
			await bookInstance.save();
			res.redirect(bookInstance.url);
		}
	}),
];

exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
	const bookInstance = await BookInstance.findById(req.params.id)
		.populate('book')
		.exec();

	res.render('bookinstance_delete', {
		title: 'Delete Book Instance',
		bookInstance: bookInstance,
	});
});

exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
	const bookInstance = await BookInstance.findById(req.params.id)
		.populate('book')
		.exec();
	const book = bookInstance.book
  console.log(req.body)
	await BookInstance.findByIdAndDelete(req.params.id).exec();
	res.redirect(book.url);
});

exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
	const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec()
	const bookinstance = await BookInstance.findById(req.params.id).populate("book")

	console.log("id =", req.params.id)
	console.log(bookinstance)

	res.render("bookinstance_form", {
		title: "Update Book Instance",
		book_list: allBooks,
		selected_book: bookinstance.book._id.toString(),
		bookinstance: bookinstance,
	});
});

exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
	res.send('NOT IMPLEMENTED: BookInstance update POST');
});
