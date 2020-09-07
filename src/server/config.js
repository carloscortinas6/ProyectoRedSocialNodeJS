const path = require('path'); //une directorios
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer =  require('multer');
const express = require('express');
const routes = require('../routes/index');
const errorHandler = require('errorhandler');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')



module.exports = app => {
    //settings
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '../views')); //para las vistas usa la direccion de src + views
    app.engine('.hbs', exphbs({
        defaultLayout: 'main', //configuraciones de hbs, vista principal 'main' 
        partialsDir:  path.join(app.get('views'), 'partials'), //pequeños pedazos de html que podemos reutilizar en diferentes vistas
        layoutsDir:  path.join(app.get('views'), 'layouts'),
        extname: '.hbs',
        helpers: require('./helpers'),    //funciones para usar dentro de handlebars
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    }));
    app.set('view engine', '.hbs');

    //middlewares
    app.use(morgan('dev'));
    app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image')); //cuando se suba una imagen que la ponga en esa carpeta
    app.use(express.urlencoded({extended: false}))  //para poder recibir los datos que vienen desde formularios
    app.use(express.json()); //para el uso de ajax


    //routes
    routes(app)

    //static files
    app.use( '/public' , express.static(path.join(__dirname, '../public')));

    //errorHandler
    if('development' === app.get('env')){
        app.use(errorHandler);
    }

    return app;
}