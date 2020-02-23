/**
 * APP ENTRY POINT
 */

'use strict';

const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const sequelize = require('./models').sequelize;

/* Routes file */
const users = require('./routes/users');
const courses = require('./routes/courses');

/* Variable to enable global error logging */
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

/* create the Express app */
const app = express();

/* add cors  */
app.use(cors());

/* setup morgan which gives us http request logging */
app.use(morgan('dev'));

/* json middleware — helps with being able to use req.body in route handlers */
app.use(express.json());


/* Test the DB connection */
(async () => {
  console.log('Testing the connection to the database...');
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


/* Root route redirect to the '/users' route */
app.get('/', (req, res) => {
  res.redirect('api/courses');
});

/* Routes with '/api' prefix added */
app.use('/api', users);
app.use('/api', courses);


/* 404 handler */
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});


/** 
 * Global error handler 
 * 
 */
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  /* Array to hold error messages */
  let errMsgs = [];
  
  if (err) {
    console.log('Error name: ' + (err.name));
    
    /* Set error status based on error name */
    if (err.name === 'SequelizeValidationError' || 
        err.name === 'SequelizeUniqueConstraintError' || 
        err.message === 'Illegal arguments: undefined, string') {
      err.status = 400;
    }

    /* Set custom unique ORM validation errors status to 403 */
    if (err.name === 'customUniqueError') {
      err.status = 403;
    }

    /* Map errors and push messages to array */
    if (err.errors) {
      err.errors.map(err => {
        errMsgs.push(err.message);
      });
    } else {
      errMsgs = err.message;
    }
  }

  res.status(err.status || 500).json( { message: errMsgs } );
});

/* set port */
const port = process.env.PORT || 5000;

/* Start listening on our port */
app.listen(port, () => {
  console.log(`Express server is listening on port ${ port }`);
});
