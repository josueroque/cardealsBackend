

'use strict';
const nodemailer = require('nodemailer'); 
const transport = nodemailer.createTransport({ 
      service: 'gmail',   
      auth: {     user: 'carsdealshn',   
                  pass: 'Bootcamp20'  
         } 
});
module.exports = transport;

