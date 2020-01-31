/**
 * COURSE MODEL
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: {
          msg: "Please enter a course title"
        },
        async uniqueCourseTest(courseTitle) {
          /* Custom test - Check course doesn't already exist before creating */
          const course = await Course.findAll({ where: { title: courseTitle } }) || [];
          if (course.length) {        
            throw new Error('That course already exists, yo');
          }
        }
      }
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      validate: {
        notEmpty: {
          msg: "Please enter a course description"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    hooks: {
      beforeDestroy: async (course, options) => {
        /* Custom test - Check user owns course before deleting */
        const {currentUserId, courseId} = options
        if (currentUserId !== courseId) {
          const err = new Error();
          err.name = 'customUniqueError';
          err.message = `You can't delete that course.  It ain't yours, yo!`
          throw err;
        }
      },

      beforeUpdate: async (course, options) => {
        /* Custom test - Check user owns course before updating */
        const {currentUserId, courseId} = options;
        if (currentUserId !== courseId) {
          const err = new Error();
          err.name = 'customUniqueError';
          err.message = `You can't update that course.  It ain't yours, yo!`
          throw err;
        }
      }
    }
  });

  /* MODEL ASSOCIATION */
  Course.associate = (models) => {
   Course.belongsTo(models.User, {
    as: 'creator',
    foreignKey: {
      fieldName: 'userId',
      allowNull: false,
    },
  });
  };

  return Course;
};
