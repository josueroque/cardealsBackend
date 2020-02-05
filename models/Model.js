'use strict';

const mongoose = require('mongoose');
// definimos un esquema
    const modelSchema = mongoose.Schema({
        name: String,
        make: String,
        
        }

    );

modelSchema.statics.list = async function ({filter}) {
  const query = Model.find(filter);
  //query.sort(sortField);
  // query.select('nombre venta');

  const result = {};

  return query.exec();
};

modelSchema.statics.listTags = function() {
const query = Model.distinct() ;
// console.log(filter);

// query.start(start);
return query.exec();
};


const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
