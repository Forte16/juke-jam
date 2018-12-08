import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Host from './Host';

class HostVerify extends Component {
  constructor() {
    super();
    this.state = {
      isValid: '',
    };
  }

  componentDidMount() {
    if (this.props.musicInstance.isAuthorized) {
      this.setState({ isValid: true });
    } else {
      this.setState({ isValid: false });
    }
  }

  render() {
    if (this.state.isValid === true || this.state.isValid === false) {
      if (this.state.isValid === true) {
        return <Host musicInstance={this.props.musicInstance} />;
      }
      return (
        <Redirect to="/" />
      );
    }
    return <div />;
  }
}

HostVerify.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};

export default HostVerify;
