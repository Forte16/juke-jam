import React from 'react';
import { Route } from 'react-router-dom';
import Header from '../presentational/Header';

const HeaderRoute = ({ render: InnerComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div className="m-0">
        <Header />
        <div id="headerBuffer" />
        <InnerComponent
          {...props}
        />
      </div>
    )}
  />
);

export default HeaderRoute;
