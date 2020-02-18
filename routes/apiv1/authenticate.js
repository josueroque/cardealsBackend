'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/User');

//Register
router.post('/register', async (req, res, next) => {
  try {
   // console.log(req.body);
    const data = req.body;
    
    const user = new User(data);
    user.password=User.hashPassword(user.password);
    const userSaved = await user.save();

    res.json({ success: true, result: userSaved });

  } catch (err) {
    // console.log('desde auth');
    // console.log(err.errmsg);
    next(err );
  }
});

// POST /authenticate
router.post('/', async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    // hacemos un hash de la password
    const hashedPassword = User.hashPassword(password);

    const user = await User.findOne({ email: email,password:hashedPassword });
    console.log(user + hashedPassword);
    if (!user) {
      // Respondemos que no son validas las credenciales
      res.json({ok: false, error: 'invalid credentials'})
      return;
    }

    // el usuario está y coincide la password

    // creamos el token
    jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    }, (err, token) => {
      if (err) {
        return next(err);
      }
      // respondemos con un JWT
      res.json({ok: true, token: token,name:user.name,nickname:user.nickname,_id:user._id,favorites:user.favorites});
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
