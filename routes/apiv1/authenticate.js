'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/User');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const ResetRequest = require('../../models/resetRequests');

router.put('/reset', async(req, res,next) => {
try {
  
  const thisRequest = await ResetRequest.findOne({id:req.body.id});
  console.log('request');
  console.log(req.body.password);
  if (thisRequest) {
      const user = await User.findOne({email:thisRequest.email});
//      const hashed= await bcrypt.hash(req.body.password, 10);
      const hashed=User.hashPassword(req.body.password);
      console.log('user');
      console.log(user._id);          
      user.password = hashed;
      
      await User.findOneAndUpdate({_id: user._id} ,{password:hashed},{ new: true }).exec();
      res.status(204).json('password changed!');

  //     bcrypt.hash(req.body.password, 10).then(hashed => {
  //         console.log('user');
  //         console.log(user);          
  //         user.password = hashed;
  //         User.findOneAndUpdate(user);
  //         res.status(204).json('password changed!');
  //     });
   } else {
       res.status(404).json('Request not found');
 }
} catch (error) {
  next(error);
}}
);

router.post('/forgot', async(req,res,next) => {
  try {

  const thisUser =await User.findOne({email:req.body.email});

  if (thisUser) {
      console.log('desde endpoint pass: '+ process.env.mailPassword  + ' user: '+ process.env.mailUser);
      const id = uuidv1();
      const request = {
          id,
          email: thisUser.email,
      };
     await ResetRequest.create(request);
      console.log('user');
      console.log(thisUser);
     
      let result= await thisUser.sendEmail(
        'carsdealshn@gmail.com',
        'Reset password',
        `To reset your password, please click on this link: https://carsdeals.netlify.app/ResetPassword/${id}`);
      console.log(result);    

      // sendResetLink(thisUser.email, id);
  }
  res.status(200).json('Request created!');

} catch (err) {
  console.log(err);
  next(err );
}

});

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
      console.log(user);
      res.json({ok: true, token: token,name:user.name,nickname:user.nickname,_id:user._id,favorites:user.favorites});
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
