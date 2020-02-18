'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.put('/:id', async (req, res, next) => {
    try {
      let data = req.body;
  
      const id=req.params.id;
      console.log('PUT');
     console.log(data.favorites);
     console.log(id);
  
     const userEdited = await User.findOneAndUpdate({_id: id}, {favorites:data.favorites}, { new: true }).exec();
  
      res.json({ success: true, result: 'Added as favorites:'});
  
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
    
  module.exports = router;