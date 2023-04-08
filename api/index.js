const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

//BD
const { host, user, password, database } = require('./db/credentials');

// Inicializacion
const app = express();
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
app.use(require('./routes/orden'));


// Servidor
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });