

'use strict';
const nodemailer = require('nodemailer'); 
const transport = nodemailer.createTransport({ 
      port: 587, 
      host: 'smtp.gmail.com',
      service: 'gmail',   
      auth: {     user: 'carsdealshn',   
                  pass: 'Bootcamp20'  
         } 
});
module.exports = transport;

