'use strict';

const mongoose = require('mongoose');
// definimos un esquema
    const makeSchema = mongoose.Schema({
        name: String,
        image: String,
        
        }

    );

makeSchema.statics.list = async function () {
  const query = Make.find();
  //query.sort(sortField);
  // query.select('nombre venta');

  const result = {};

  return query.exec();
};

makeSchema.statics.listTags = function() {
const query = Make.distinct() ;
// console.log(filter);

// query.start(start);
return query.exec();
};


const Make = mongoose.model('Make', makeSchema);

module.exports = Make;
