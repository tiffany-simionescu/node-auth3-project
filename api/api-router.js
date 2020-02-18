const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

const Users = require('./api-model');
const restricted = require('../auth/restricted-middleware.js');

// function to generate a new token for a user
function generateToken(user) {
  return jwt.sign({
    userId: user.id,
    userDepartment: "WEB",
  }, secrets.jwtSecret, {
    expiresIn: '1h',
  })
};

// GET - /api/users
router.get('/users', restricted("WEB"), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.json({
        message: "You shall not pass!"
      });
    })
})

// POST - /api/register
router.post('/register', (req, res) => {
  let user = req.body;
  let hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = generateToken(saved);

      res.status(201).json({
        message: `Welcome ${saved.username}!`,
        userDepartment: user.department,
        authToken: token,
      });
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

// POST - /api/login
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          userDepartment: user.department,
          authToken: token,
        });
      } else {
        res.status(401).json({
          message: "You shall not pass!"
        })
      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

module.exports = router;