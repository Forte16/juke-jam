import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Lobby from './Lobby';

class LobbyVerify extends Component {
  constructor() {
    super();
    this.state = {
      playlistID: '',
      isValid: '',
    };
    this.checkLobby = this.checkLobby.bind(this);
    this.isAuthorized = this.isAuthorized.bind(this);
    this.ownsPlaylist = this.ownsPlaylist.bind(this);
    this.sendHome = this.sendHome.bind(this);
  }

  componentDidMount() {
    // Code for getting playlistID from URL
    const url = window.location.href;
    const index = window.location.href.indexOf('obby/');
    const idURL = url.substring(index + 5);
    this.setState({ playlistID: idURL }, function () {
      Promise.all([this.checkLobby(), this.isAuthorized(), this.ownsPlaylist()])
        .then(() => {
          this.setState({ isValid: true });
        });
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
        that.sendHome();
      }
    });
  }

  isAuthorized() {
    if (!this.props.musicInstance.isAuthorized) {
      this.sendHome();
    }
  }

  ownsPlaylist() {
    this.props.musicInstance.api.library.playlist(`p.${this.state.playlistID}`)
      .catch(() => {
        this.sendHome();
      });
  }

  sendHome() {
    this.props.history.push({
      pathname: '/',
    });
  }

  render() {
    if (this.state.isValid === true || this.state.isValid === false) {
      if (this.state.isValid === true) {
        return (
          <Lobby
            playlistID={this.state.playlistID}
            musicInstance={this.props.musicInstance}
          />
        );
      }
      return <Redirect to="/" />;
    }
    return <div />;
  }
}

LobbyVerify.propTypes = {
  musicInstance: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(LobbyVerify);
