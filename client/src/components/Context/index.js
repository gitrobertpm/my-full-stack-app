import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const CourseAppContext = React.createContext();
export const Consumer = CourseAppContext.Consumer;


/**
 * @description - Context class
 * @export
 * @class Provider
 * @extends {Component}
 */
export class Provider extends Component {

  state = {
    courseList: [],
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    user: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      userId: null
    },
    errors: [],
    from: null,
  };

  constructor() {
    super();
    this.data = new Data();
  }


  /**
   * @description - Get courses from API
   */
  getCourses = async () => {
    const response = await this.data.getCourses();

    if (response.length) {
      this.setState({
        courseList: response
      });
    }
    
    return response;
  }


  
  /**
   * @description - Sign into app
   */
  signIn = async (email, password) => {
    console.log('Sign In', email, password);
    const user = await this.data.getUser(email, password);
    const authUser = {...user, password}

    if (user.res !== null) {   
      this.setState(() => {
        return {
          authenticatedUser: authUser,
        };
      });

      Cookies.set('authenticatedUser', JSON.stringify(authUser), { expires: 1 });

    } else {
      this.setState(() => {
        return {
          authenticatedUser: null,
        };
      });
    }
    return user;
  }


  /**
   * @description - Sign out of app
   */
  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
    Cookies.remove('username');
  }

  
  render() {
    return (
      <CourseAppContext.Provider value={{
        courseList: this.state.courseList,
        user: this.state.user,
        authenticatedUser: this.state.authenticatedUser,
        data: this.data,
        errors: this.errors,
        from: this.from,
        actions: {
          getCourses: this.getCourses,
          signIn: this.signIn,
          signOut: this.signOut,
          addCourse: this.addCourse,
          updateCourse: this.updateCourse,
          deleteCourse: this.deleteCourse
        }
      }}>
        { this.props.children }
      </CourseAppContext.Provider>
    );
  }
}

export default CourseAppContext;