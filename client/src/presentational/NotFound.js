import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import '../css/tailwind.css';

class NotFound extends Component {
  componentDidMount() {
    this.props.history.push({
      pathname: '/',
    });
  }

  render() {
    return (
      <div />
    );
  }
}

NotFound.propTypes = {
  history: PropTypes.object.isRequired,
};


export default withRouter(NotFound);
