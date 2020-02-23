/**
 * COURSE ROUTES - Getting, creating, updating and deleting
 */

'use strict';

const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const helpers = require('./helpers');

/* Defining helpers */
const authenticateUser = helpers.authenticateUser;
const asyncHandler = helpers.asyncHandler;

/* Declaring retrieved model attributes */
const CourseAttributes = ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'];
const CourseWithAttributesAndIncludes = {
  attributes: CourseAttributes,
  include: [{
    model: User,
    attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
    as: 'creator',
  }]
}

/* Shorthand for returning req.body */
const courseAttributesObject = body => {
  const { title, description, estimatedTime, materialsNeeded, userId } = body;
  return { title, description, estimatedTime, materialsNeeded, userId };
}

/*** 
 * ROUTE HANDLERS
 * AsyncHandler and authentication handled in ./helpers
 * Validation handled in Course ../models/course
 * Errors handled in global error handler 
**/

/* GET /api/courses 200
   Returns list of courses (including the user that owns each course) */
router.get('/courses', asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll(CourseWithAttributesAndIncludes);
  res.status(200).json(courses);
}));

/* GET /api/courses/:id 200 
   Returns course (including the user that owns the course) for the provided course ID */
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, CourseWithAttributesAndIncludes);
  res.status(200).json(course) ;
}));

/* POST /api/courses 201 
   Authenticates user, creates a course, sets the Location header to the URI for the course, and returns no content */
router.post('/courses', authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.create(courseAttributesObject(req.body));
  res.location(`/courses/:${course.id}`).status(201).end();
}));

/* PUT /api/courses/:id 204 
   Authenticates user, updates a course, sets the Location header to the URI for the course, and returns no content */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  await course.update(courseAttributesObject(req.body), {currentUserId: req.currentUser.id, courseId: course.userId});
  res.location(`/courses/:${course.id}`).status(204).end();
}));

/* DELETE /api/courses/:id 204 
   Authenticates user, deletes a course and returns no content */
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id); 
  await course.destroy({currentUserId: req.currentUser.id, courseId: course.userId});
  res.location('').status(204).end();
}));

module.exports = router;