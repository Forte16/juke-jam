import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Guest from '../container/Guest';
import Verifying from '../presentational/Verifying';

class GuestVerify extends Component {
  constructor() {
    super();
    this.state = {
      playlistID: '',
      isValid: '',
      name: '',
    };
    this.checkLobby = this.checkLobby.bind(this);
  }

  componentDidMount() {
    // Code for getting playlistID from URL
    const url = window.location.href;
    const index = window.location.href.indexOf('mend/');
    const idURL = url.substring(index + 5);
    this.setState({ playlistID: idURL }, function () {
      this.checkLobby();
    });
  }

  checkLobby() {
    const that = this;
    fetch(`${process.env.REACT_APP_API_DOMAIN}/exists?lobbyID=${this.state.playlistID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status === 404) {
        that.setState({ isValid: false });
        return null;
      }
      return response.json();
    }).then((resp) => {
      if (resp) {
        that.setState({ name: resp.lobby.name, isValid: true });
      }
    });
  }

  render() {
    if (this.state.isValid === true || this.state.isValid === false) {
      if (this.state.isValid === true) {
        return (
          <Guest
            name={this.state.name}
            playlistID={this.state.playlistID}
            musicInstance={this.props.musicInstance}
          />
        );
      }
      return <Redirect to="/" />;
    }
    return <Verifying />;
  }
}

GuestVerify.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};

export default GuestVerify;
