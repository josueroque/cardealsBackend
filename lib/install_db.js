'use strict';

//load library
const mongoose = require('mongoose');
const con = mongoose.connection;
const Advert = require('../models/Advert');
const fs = require('fs');
var process;


// HANDLE CONNECTION ERRORS
con.on('error', err => {
  console.log('Error', err);
  process.exit(1);
});

con.once('open',async () => {
  try {
   let adsArray= await convertJSON();
    await Advert.deleteMany();
    console.log(adsArray);
    await Advert.insertMany( adsArray);
    
   
    console.log('Database initialized succesfully');

    const User = require('../models/User');
    await User.deleteMany();
    await  Make.insertMany([
      {name: 'Josué',nickname:'Roque', email: 'josueroque@yahoo.com',
       password: User.hashPassword('motagua'),favorites:[]}
    ]);

      await con.close();

      const Make = require('../models/Make');
      await Make.deleteMany();
      await  Make.insertMany([
        {name: 'Chevrolet',image:'https://s8096.pcdn.co/wp-content/uploads/2014/10/Chevrolet-Logo.jpg'},
        {name: 'Toyota',image:'https://s8096.pcdn.co/wp-content/uploads/2014/10/toyota-logo1.jpg'},
        {name: 'Suzuki',image:'https://s8096.pcdn.co/wp-content/uploads/2014/10/suzuki-logo.jpg'}
      ]);

        await con.close();
        const Model = require('../models/Model');
        await Model.deleteMany();
        await  Model.insertMany([
          {'name' : 'Alto','make' : 'Suzuki'},
          {'name' : 'Grand Vitara','make' : 'Suzuki'},
          {'make' : 'Toyota','name' : 'Corolla'}
        ]);
  
          await con.close();
    

  //  server.close();
    
  } catch (error) {
  console.log(error);  
  }
});

function convertJSON(){
  let data;
  try {
     data = JSON.parse(fs.readFileSync('../lib/adverts.json'));
     console.log('desde convert');
     console.log (data['adverts']);
     return data['adverts'];

  } catch ( err ) {
    console.log(err);
    throw new Error('Error reading the file');
  }
}

mongoose.connect('mongodb://localhost/Cardeals', { useNewUrlParser: true });
