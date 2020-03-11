'use strict';

// cargar libreria
const mongoose = require('mongoose');
const conn = mongoose.connection;
//var process;//Eslint suggestion

mongoose.set('useFindAndModify', false);

conn.on('error', err => {
  console.log('Conection error', err);
  process.exit(1);
});//

conn.once('open', () => {
  console.log('Conected to MongoDB at', mongoose.connection.name);
});
console.log(process.env.DATABASE_URI);
//mongoose.connect('mongodb://localhost/Cardeals' , { useNewUrlParser: true });
mongoose.connect(process.env.DATABASE_URI,  { useNewUrlParser: true } );


module.exports = conn;