/**
 * HELPERS FOR ROUTE HANDLERS - asyncHandler and authentication
 */
'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');


/* try catch asynchronously  */
exports.asyncHandler = (cb) => {
  return async (req,res,next) => {
    try {
      await cb(req,res,next);
    } catch(err) {
      console.log('err test: ', err);
      next(err);
    }
  }
}

/* Authenticate user */
exports.authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  console.log(credentials);
  // If the user's credentials are available...
  if (credentials.name) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    //const user = users.find(u => u.username === credentials.name);
    const user = await User.findOne({ where: { emailAddress: credentials.name } })

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for: ${user.firstName}`);

        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for: ${user.firstName}`;
      }
    } else {
      message = `User not found for email: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};