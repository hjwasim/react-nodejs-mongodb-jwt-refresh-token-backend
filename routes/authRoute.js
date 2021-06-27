const { logout__controller, signup__controller, signin__controller } = require('../controller/authController');
const { validationResults, verifyToken, signup__Validator, signin__Validator } = require('../middlewares/authMiddleware');

const router = require('express').Router()

router.post('/signup', signup__Validator, validationResults, signup__controller);
router.post('/signin', signin__Validator, validationResults, signin__controller);
router.get('/verify', verifyToken)
router.get('/logout', logout__controller)

module.exports = router;