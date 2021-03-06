import React from 'react';
import { NavLink } from 'react-router-dom';

const Errors = (props) => {

  return (
    <div className="bounds">
      <div className="grid-50">
        <h1 className="header--logo error-heading"><span role="img" aria-label="Scream emoji">&#128561;</span> Error <span role="img" aria-label="Scream emoji">&#128561;</span></h1>
        <br />
        <br />
        <p className="course--title"> Oops, apparently we've encountered an error on the server!  So sorry! <span role="img" aria-label="Sad emoji">&#128546;</span></p>
        <br />
        <p className="course--title">Please check back soon.  We hope to have this resolved shortly. <span role="img" aria-label="Fingers crossed emoji">&#129310;</span></p>
        <br />
        <p className="course--title">{props.err}</p>
        <br />
        <br />
        <NavLink className="button" to="/">Back to the home page</NavLink>
      </div>
    </div>
  );
}

export default Errors;