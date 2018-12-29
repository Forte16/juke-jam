import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Edit from '../container/Edit';
import Verifying from '../presentational/Verifying';
import Header from '../presentational/Header';

class EditVerify extends Component {
  constructor() {
    super();
    this.state = {
      playlistID: '',
      name: '',
      max: 0,
      isValid: '',
      playlistArtwork: '',
      playlistTitle: '',
    };
    this.checkLobby = this.checkLobby.bind(this);
    this.isAuthorized = this.isAuthorized.bind(this);
    this.ownsPlaylist = this.ownsPlaylist.bind(this);
    this.sendHome = this.sendHome.bind(this);
  }

  componentDidMount() {
    // Code for getting playlistID from URL
    const url = window.location.href;
    const index = window.location.href.indexOf('edit/');
    const idURL = url.substring(index + 5);
    this.setState({ playlistID: idURL }, function () {
      Promise.all([this.isAuthorized(), this.ownsPlaylist()])
        .then(() => {
          this.checkLobby();
        }).catch(() => this.sendHome());
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
        return null;
      }
      return response.json();
    }).then((resp) => {
      if (resp == null) return;
      this.setState({
        isValid: true,
        max: resp.lobby.max_recommendations,
        name: resp.lobby.name,
      });
    });
  }

  isAuthorized() {
    return new Promise((resolve, reject) => {
      if (!this.props.musicInstance.isAuthorized) {
        reject();
      }
      resolve();
    });
  }

  ownsPlaylist() {
    return new Promise((resolve, reject) => {
      this.props.musicInstance.api.library.playlist(`p.${this.state.playlistID}`)
        .then((resp) => {
          this.setState({
            playlistArtwork: window.MusicKit.formatArtworkURL(resp.attributes.artwork),
            playlistTitle: resp.attributes.name,
          });
          resolve();
        }).catch(() => {
          reject();
        });
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
          <div>
            <Header />
            <Edit
              playlistID={this.state.playlistID}
              name={this.state.name}
              max={this.state.max}
              playlistArtwork={this.state.playlistArtwork}
              playlistTitle={this.state.playlistTitle}
            />
        </div>
        );
      }
      return <Redirect to="/" />;
    }
    return <Verifying />;
  }
}

EditVerify.propTypes = {
  musicInstance: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(EditVerify);