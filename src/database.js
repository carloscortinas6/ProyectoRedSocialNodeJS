const mongoose = require('mongoose');
const {database} = require('./keys');

mongoose.connect(database.URI, {
    useNewUrlParser: true, //trabajo interno de mongodb
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));