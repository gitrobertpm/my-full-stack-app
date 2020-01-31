/**
 * USER ROUTES - Getting, creating
 */
'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const helpers = require('./helpers');

/* Defining helpers */
const authenticateUser = helpers.authenticateUser;
const asyncHandler = helpers.asyncHandler;

/* Shorthand for returning req.body */
const userCreate = body => {
  if(body.password) {
    body.password = bcryptjs.hashSync(body.password);
  }

  const { firstName, lastName, emailAddress, password } = body;
  return { firstName, lastName, emailAddress, password };
}

/*** 
 * ROUTE HANDLERS
 * AsyncHandler and authentication handled in ./helpers
 * Validation handled in Course ../models/user
 * Errors handled in global error handler 
**/

/* get /api/users 200 
   Returns the currently authenticated user (including the courses created by user) */
router.get('/users', authenticateUser, (req, res, next) => {
  const { id, firstName, lastName, emailAddress } = req.currentUser;
  res.json( { id, firstName, lastName, emailAddress } );
});

/* post /api/users 201 
   Creates a user, sets the Location header to "/", and returns no content - validation handled in global error handler */
router.post('/users', asyncHandler(async (req, res, next) => {
  await User.create(userCreate(req.body));
  res.location('/').status(201).end();
}));

module.exports = router;