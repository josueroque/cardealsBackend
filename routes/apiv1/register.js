
'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/User');


router.post('/', async (req, res, next) => {
    try {
      //console.log(req.body);
      const data = req.body;
      
      const user = new User(data);
      user.password=User.hashPassword(user.password);
      const userSaved = await user.save();
  
      res.json({ success: true, result: userSaved });
  
    } catch (err) {
      console.log('desde register');
      console.log(err);
      next(err );
    }
  });