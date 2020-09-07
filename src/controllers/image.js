const path = require('path');
const {randomNumber} = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');
const {Image, Comment} = require('../models/index');
const { json } = require('express');
const ctrl = {};


ctrl.index = async (req,res) => {
   let viewModel = { image: {}, comments: [] };
  const image = await Image.findOne({filename: { $regex: req.params.image_id }});
  if (image) {
    image.views = image.views + 1;
    viewModel.image = image;
    image.save();
    const comments = await Comment.find({image_id: image._id})
      .sort({'timestamp': 1});
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render('image', viewModel);
  } else {
    res.redirect('/');
  }
   
}
 
ctrl.create = (req,res) => {

   const saveImage = async () => {
      const imgUrl  = randomNumber(); //devuelve un string aleatorio de numeros y letras(nombre de la imagen cuando se sube) 
     const images =  await Image.find({filename: imgUrl}); //para ver si el nombre de una imagen es repetida o no, si se repite haces llamada recursiva
      if(images.length > 0){
         saveImage();
      }else{
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`)
  
      if(ext === '.png' || ext === '.jpg' || ext === '.gif'){
         await fs.rename(imageTempPath, targetPath)  //mueve la imagen desde un directorio a otro
          const newImg = new Image({
              title: req.body.title,
              filename: imgUrl + ext,
              description: req.body.description
           });
          const imageSaved = await newImg.save();
          res.redirect('/images/' + imageSaved.uniqueId);
        }else{ //en caso que lo que suba no sea una imagen la eliminamos y mandamos un msj
           await fs.unlink(imageTempPath);
           res.status(500).json({error: 'Only images are allowed'});
        }
      }
  
   
}
      saveImage();
}

ctrl.like = async(req,res) => {
  const image = await Image.findOne({filename: {$regex:req.params.image_id}})
   if(image) {
      image.likes = image.likes + 1;
      await image.save();
      res.json({likes: image.likes});
   }else{
        res.status(500).json({error: 'internal error'});
   }
    
}

ctrl.comment = async (req,res) => {
   const image = await Image.findOne({filename: {$regex: req.params.image_id}});
   if(image){
   const newComment = new Comment(req.body);
   newComment.gravatar = md5(newComment.email);
   newComment.image_id = image._id;
   await newComment.save();
   res.redirect('/images/' + image.uniqueId + '#' + newComment._id);
   }else{
      res.redirect('/');
   }
}


ctrl.remove = async (req,res) => {
  const image = await Image.findOne({filename:  {$regex: req.params.image_id}});
  if(image){
     await fs.unlink(path.resolve('./src/public/upload/' + image.filename))  //remueve el dato a partir de una direccion que le das
     await Comment.deleteOne({image_id: image._id});
     await image.remove();
     res.json(true);
  }else{
     res.json({response: 'Bad Request.. :('})
  }
};




module.exports = ctrl;