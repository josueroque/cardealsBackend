

'use strict';
const nodemailer = require('nodemailer'); 
const transport = nodemailer.createTransport({ 
      service: 'SendGrid',   
      auth: {     user: 'josueroque',   
                  pass: 'Bootcamp20'  
         } 
});
module.exports = transport;

