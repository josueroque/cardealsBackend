  'use strict';
  const path = require('path');
  const cote = require('cote');
  const fs = require('fs-extra');
  const flow = require('../lib/flowControl');
  const mongoose = require('mongoose');
  const configAdverts = require('../local_config').adverts;
  const thumbnailRequester = new cote.Requester({
    name: 'thumbnail creator client'
  }, { log: false, statusLogsEnabled: false });
  // definimos un esquema
  const advertSchema = mongoose.Schema({
    user: String,
    unserNickname:String,
    make: String,
    model: String,
    year:String,
    photo:Array,
    price:Number,
    currency:String,
    transmition:String,
    description:String,
    sell:Boolean,
    country:String,
    city:String,
    active:Boolean,
    reserved:Boolean,
    createdAt:Date,


  }

  );

  advertSchema.statics.list = async function (filters, startRow, numRows, sortField, includeTotal, cb) {
    const query = Advert.find(filters);
    query.sort(sortField);
    query.skip(startRow);
    query.limit(numRows);
    // query.select('nombre venta');
  
    const result = {};
  
    if (includeTotal) {
      result.total = await Advert.count();
    }
    result.rows = await query.exec();
  
    // poner ruta base a imagenes
    const ruta = configAdverts.imagesURLBasePath;
    result.rows.forEach(r => (r.photo = r.photo ? path.join(ruta, r.photo) : null));
  
    if (cb) return cb(null, result); // si me dan callback devuelvo los resultados por ahí
    return result; // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
  }
  
  advertSchema.methods.setPhoto = async function (imageObject) {
    //console.log(imageObject);
    if (!imageObject) return;
    // copiar el fichero desde la carpeta uploads a public/images/anuncios
    // usando en nombre original del producto
    // IMPORTANTE: valorar si quereis poner el _id del usuario (this._id) para
    // diferenciar imagenes de distintos usuarios con el mismo nombre

    const dstPath = path.join(__dirname, '../public/images/adverts', imageObject.originalname);
    await fs.copy(imageObject.path, dstPath);
    this.Photo = imageObject.originalname;
  console.log('hola' + this.Photo);
    thumbnailRequester.send({
      type: 'createThumbnail',
      image: dstPath
    });
  }

advertSchema.statics.list = function({filter, skip, limit, fields, sort}) {
  const query = Advert.find(filter);
 // console.log(filter);
  query.skip(skip);
  query.limit(limit);
  query.select(fields);   
 
  query.sort(sort);

 // query.start(start);
  return query.exec();
};

advertSchema.statics.listTags = function() {
  const query = Advert.distinct('tags') ;
 // console.log(filter);

 // query.start(start);
  return query.exec();
};


const Advert = mongoose.model('Advert', advertSchema);

module.exports = Advert;
