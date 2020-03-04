'use strict';

const mongoose = require('mongoose');

// definimos un esquema
    const resetRequestSchema = mongoose.Schema({
        id: String,
        email:String
        }

    );

resetRequestSchema.statics.list = async function () {
  const query = await ResetRequest.find();
  //const result = {}   ;
  return query.exec();
};

const ResetRequest = mongoose.model('ResetRequest', resetRequestSchema);

module.exports = ResetRequest;

