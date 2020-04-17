

'use strict';
const nodemailer = require('nodemailer'); 
const transport = nodemailer.createTransport({ 
      port: 587, 
      host: 'smtp.gmail.com',
      service: 'gmail',   
      auth: {     user: process.env.mailUser,   
                  pass: process.env.mailPassword 

                  
         } 
});
module.exports = transport;

