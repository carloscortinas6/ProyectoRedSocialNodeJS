const {Comment, Image} = require('../models');

module.exports = {
     async newest(){
         try{
            const comments = await Comment.find() //devuelve un array
            .limit(5)
            .sort({timestamp: -1});
            if(comments){
      for(const comment of comments){  //recorremos todos los comentarios para encontrar sus imagenes
          const image = await Image.findOne({_id: comment.image_id});  //trae la imagen que pertenece al comentario
          comment.image = image;  
        }      }

        return comments;
    }catch(err){
        console.log(err);
    }
         
      

    }
    
}