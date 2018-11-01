require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const secretOrKey = process.env.SECRET_OR_KEY;
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

exports.registerUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        res.status(400).json(errors);
      }

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(userData => res.json(userData))
            .catch(err => console.error(err));
        });
      });
    });
};

exports.loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;

  User
    .findOne({ email })
    .then((user) => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const { id, name, password } = user;
            const payload = { id, name, password };

            jwt.sign(payload, secretOrKey, { expiresIn: 36000 }, (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`,
              });
            });
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        });
    });
};

exports.currentUser = (req, res) => {
  const { id, name, email } = req.user;

  res.json({ id, name, email });
};
