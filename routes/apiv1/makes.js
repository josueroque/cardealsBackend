'use strict';

const express = require('express');
const router = express.Router();
const Make = require('../../models/Make');
const Model = require('../../models/Model');

//List of makes
router.get('/', async (req, res, next) => {
  try {
   // console.log(req.body);
    // const data = req.body;
    
    // const user = new User(data);
    // user.password=User.hashPassword(user.password);
   
    const makes = await Make.list();

    res.json({ success: true, results: makes });

  } catch (err) {
    // console.log('desde auth');
    // console.log(err.errmsg);
    next(err );
  }
});

//List of models
router.get('/models', async (req, res, next) => {
    try {
     
      

       console.log(req.query.make);
      
       let filter= {make:req.query.make};

      const models = await Model.list({filter: filter});
  
      res.json({ success: true, results: models });
  
    } catch (err) {
      console.log(err);
      // console.log(err.errmsg);
      next(err );
    }
  });
  

module.exports = router;
