import React, { Component } from 'react';
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
    )
  }
}

export default withRouter(NotFound);
