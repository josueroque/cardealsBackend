'use strict';

const express = require('express');
//const mongoose=require('mongoose');
const upload=require('../../lib/multerConfig');
const router = express.Router();
const Advert = require('../../models/Advert');
const User = require('../../models/User');
//const { query, body, param, validationResult } = require('express-validator');

//const jwtAuth=require('../../lib/jwtAuth');

router.put('/:id', async (req, res, next) => {
  try {
    let data = req.body;
    const users = await User.list();
    const _id=req.params.id;
    console.log('PUT');
    console.log(data);

    const advertSaved = await Advert.findOneAndUpdate({_id: _id}, data, { new: true }).exec();
    
    if (data.amountChanged===true || data.active===false ||data.reserved===true){
      console.log('desde for');
      // console.log(users);
      // console.log(users.length);
       for (let i=0;i<users.length;i++){
        console.log(_id);
          if (users[i].favorites.includes(_id)){  
            const dbuser = await User.findOne({ email: users[i].email });//user is email here
            console.log(dbuser);
            if (data.amountChanged===true){
            let result= await dbuser.sendEmail('josueroquehn@yahoo.com','prueba email','Ha cambiado de precio el anuncio<b>'+_id +' ' +'</b>');
            console.log(result);    
            }
            if (data.active===false){
              let result= await dbuser.sendEmail('josueroquehn@yahoo.com','prueba email','El anuncio <b>'+ _id +' ' +'</b>'+' ha sido marcado como vendido ');
              console.log(result);    
            }
            if (data.reserved===true){
            let result= await dbuser.sendEmail('josueroquehn@yahoo.com','prueba email','El anuncio <b>'+_id +' ' +'</b>'+' ha sido marcado como reservado ');
            console.log(result);    
            }
          }
       }
       //console.log(result);
    }
     
    res.json({ success: true, result: advertSaved });

  } catch (err) {
    console.log(err);
    next(err);
  }
});


router.post('/create',upload.array('photos'), async (req, res, next) => {
  try {
    let data = req.body;
  
    //console.log(req.files);
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
    await User.updateMany( {}, { $pullAll: {favorites: [_id] } });

    res.json({ success: true, result: 'item deleted!' });

  } catch (err) {
    console.log(err);
    next(err);
  }
});



router.get('/',async (req, res, next) => {

  try {

   
    const active=req.query.active;

    const price = req.query.price;
    const limit = parseInt(req.query.limit);
    const fields = req.query.fields;
    let sort = req.query.sort;
    const sell=req.query.sell;
    const user=req.query.user;
    const id=req.query.id;
    const make = req.query.make;
    const model = req.query.model;
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
    
    if(make){
      filter= {...filter,make:make};
    }

    if(model){
      filter= {...filter,model:model};
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

console.log('id');
 console.log(id);
    if (id){
      if(id.includes(',')){
      let id2=id.split(',');
        console.log('id2');
        console.log(id2);
        filter._id=id2;    
      }
    }
    if(!sort){
   sort='-createdAt';
  
    }
    console.log('sort');
    console.log(sort);
   //let sort={sort:'createdAt:-1'};
    const adverts = await Advert.list({ filter: filter, skip, limit, fields, sort});


   res.json({ success: true, results: adverts });


  } catch (err) {
    console.log(err);
     return  res.next(err);
    //next(err);
  }
});

  
  module.exports = router;