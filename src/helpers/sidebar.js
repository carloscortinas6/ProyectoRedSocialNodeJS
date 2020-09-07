const Stats = require('./stats');
const Images = require('./images');
const Comments = require('./comments');

module.exports = async viewModel => {

  const results = await Promise.all([  //ejecuta todas las funciones, devuelve un array con todos los resultados de las funciones
    Stats(),
    Images.popular(),
    Comments.newest()
   ]);
   
   viewModel.sideBar = {
       stats: results[0],
       popular: results[1],
       comments: results[2] 
   };
    return viewModel;
}