'use strict';

const express = require('express');
//const mongoose=require('mongoose');
const upload=require('../../lib/multerConfig');
const router = express.Router();
const Advert = require('../../models/Advert');
//const { query, body, param, validationResult } = require('express-validator');

//const jwtAuth=require('../../lib/jwtAuth');

router.post('/create',upload.array('photos'), async (req, res, next) => {
  try {
    let data = req.body;
  
    console.log(req.files);
    data.photo=[];
  
    req.files.map(element => 
        //data.photo.push(element.fieldname + '-' + data.username + '-' + element.originalname)
        data.photo.push(element.filename)
    );
    data.createdAt=Date.now();
    data.reserved=false;
    data.active=true;
    data.city='Tegucigalpa';
    console.log(data);
    console.log(data.price);
    if(data.type==='sell'){
      data.sell=true;
    }
    else{
      data.sell=false;
    }
     const advert = new Advert(data);

   //await advert.setPhoto(req.files) ;
   const advertSaved = await advert.save();

    res.json({ success: true, result: advertSaved });

  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {

    const _id = req.params.id;
   //await advert.setPhoto(req.files) ;
    await Advert.deleteOne({ _id: _id}).exec();

    res.json({ success: true, result: 'item deleted!' });

  } catch (err) {
    console.log(err);
    next(err);
  }
});



router.get('/',async (req, res, next) => {

  try {

    const model = req.query.model;
    const active=req.query.active;
    const make = req.query.make;
    const price = req.query.price;
    const limit = parseInt(req.query.limit);
    const fields = req.query.fields;
    const sort = req.query.sort;
    const sell=req.query.sell;
    const user=req.query.user;
    const id=req.query.id;
    let skip;
    
    if(req.query.skip){
      if (isNaN(req.query.skip)){

        res.status(422); 
        throw ('Invalid skip Parameter');
      }
       else{ 
     skip=parseInt(req.query.skip);
      }
    }
    
    if(req.query.limit){
      if (isNaN(parseInt(req.query.limit))){

        res.status(422); 
        throw ('Invalid limit Parameter');
      }

    }

    if(req.query.start){
  
      if (isNaN(parseInt(req.query.start))){

        res.status(422); 
        throw ('Invalid start Parameter');
      }
       else{ 
        skip=parseInt(req.query.start);
      }
    }    

    let filter = {};
    //let exp = new RegExp('^' + nombre + '','i');
   
    if(user){
      filter= {user:user};
    }

    console.log(active);
    if (active){
        if (active===true){
          filter.active=true;
        }
    }
    
    //tag filter
    // if(tag){
    //   filter.tags=tag;
    // }

    //venta filter
    if (typeof sell !== 'undefined' ){
      if(sell.toLowerCase()==='false'){
        filter.sell=false;
      }
      else if(sell.toLowerCase()==='true'){
        filter.sell=true;
      }
      else {
        res.status(422); 
        throw ('Invalid sell Parameter');
      }
    }


    //precio filter
  if (price){

    let priceStr=new String();
    priceStr=price.split('');
    let hyphen='';
    let countHyphen=0;
    let hyphenPosition=0;
  
    for (let char of priceStr){
      if (char==='-'){
        countHyphen++;
      }
      switch (countHyphen){
        case 0:
          hyphen='undef';
          break;
        case 1:
          if(priceStr.indexOf(char)===0 && char==='-'){
            hyphen='start';  
            }
          else if(priceStr.indexOf(char)===(priceStr.length-1) && char==='-'){
            hyphen='end';
           }
          else if( char==='-'){
            hyphen='middle';
            hyphenPosition=priceStr.indexOf(char);
           }
          break;  
        case 2:
          hyphen='notvalid';
          break;
        default:
          hyphen='notvalid';
          break;
        }
  }

let number1=0;
let number2=0;
let objectFilter={};

    if (typeof price !== 'undefined') {
      switch(hyphen){
        case ('start'):
          number1=price.replace('-','');
          if(isNaN(number1)){
            res.status(422);
            throw('Invalid price parameter');
          }
          objectFilter['$lt']=parseInt(number1);
          filter.precio=objectFilter; 
          break;
        case ('middle'):
          number1=price.substring(0,(hyphenPosition));
          number2=price.substring((hyphenPosition+1),(price.length));
          if(isNaN(number1)||isNaN(number2)){
            res.status(422);
            throw('Invalid price parameter');
          }
          objectFilter['$gt']=parseInt(number1);
          objectFilter['$lt']=parseInt(number2);
          filter.price=objectFilter; 
          break;    
        case ('end'):
          number1=price.replace('-','');
          if(isNaN(number1)){
            res.status(422);
            throw('Invalid price parameter');
          }
          objectFilter['$gt']=parseInt(number1);
          filter.price=objectFilter; 
          break;   
        case ('undef'):
            if(isNaN(price)){
              res.status(422);
              throw('Invalid price parameter');
            }
          filter.price=price; 
          break;            
        case ('notvalid'):
          res.status(422); 
          throw ('Invalid price Parameter');
          // return;
          // break;                 
      }
      
   
    }
  }
  
    if (id){
      filter._id=id;    
    }
    console.log('filter');
      
      console.log(filter);
    const adverts = await Advert.list({ filter: filter, skip, limit, fields, sort});


   res.json({ success: true, results: adverts });


  } catch (err) {
     return  res.next(err);
    //next(err);
  }
});

  
  module.exports = router;