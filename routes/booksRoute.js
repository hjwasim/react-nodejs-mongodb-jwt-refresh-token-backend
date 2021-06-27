const booksController = require('../controller/booksController');
const verifyJwt = require('../middlewares/verifyJwt');

const router = require('express').Router()

router.get('/',verifyJwt,booksController)

module.exports = router;