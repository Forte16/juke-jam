import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Host from '../container/Host';
import Verifying from '../presentational/Verifying';

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
    return <Verifying />;
  }
}

HostVerify.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};

export default HostVerify;
