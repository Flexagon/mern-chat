const express = require('express');
const passport = require('passport');

const UserController = require('../../controllers/user');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.post('/register', UserController.registerUser);

router.post('/login', UserController.loginUser);

router.get('/current', requireAuth, UserController.currentUser);

module.exports = router;
