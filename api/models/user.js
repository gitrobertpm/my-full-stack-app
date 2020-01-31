/**
 * USER MODEL
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        firstNameTest() {
          /* Custom test - Check first name is not empty or null before creating */
          if (this.firstName === null || this.firstName === '') {
            throw new Error('Please provide a First Name');
          }
        }
      } 
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        lastNameTest() {
          /* Custom test - Check last name is not empty or null before creating */
          if (this.lastName === null || this.lastName === '') {
            throw new Error('Please provide a Last Name');
          }
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      validate: {
        basicEmailTest(email) {
          /* Custom test - Check email address is not empty or null before creating */
          if (email === null || email === '') {
            throw new Error('Please provide an Email Address');
          } 

          /* Simple custom test - Check email address has valid format before creating */
          const lengthTest = email.length > 4;
          const atTest = email.indexOf('@') > 0;
          const dotTest = email.lastIndexOf('.') < (email.length - 1);

          if (!lengthTest || !atTest || !dotTest) {
            throw new Error('Please provide a valid Email Address');
          }

          /* Robust custom test - Check email address has valid format before creating */
          /* const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          
          if (emailPattern.test(email)) {
            throw new Error('Please provide a valid Email Address');
          } */
        },
        async uniqueEmailTest(email) {
          /* Custom test - Check email address is unique before creating */
          let user = await User.findAll({where: {emailAddress: email}}) || [];
          if (user.length) {           
            throw new Error('The Email Address you entered is already registered, yo!');
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        passwordTest() {
          if (this.password === null || this.password === '') {
            throw new Error('Please provide a Password');
          }
        }
      }
    },
  });

  /* MODEL ASSOCIATION */
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'creator',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};