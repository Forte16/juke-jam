import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../css/Host.css';
import '../css/tailwind.css';
import PropTypes from 'prop-types';
import MainButton from '../presentational/MainButton';
import MiniButton from '../presentational/MiniButton';
import Playlist from '../presentational/Playlist';
import LobbyPlaylist from '../presentational/LobbyPlaylist';

class Host extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlaylists: [],
      lobbyPlaylists: [],
      notLobbyPlaylists: [],
      max: 0,
      idSelected: 0,
      name: '',
      spinner: true,
    };
    this.musicInstance = this.props.musicInstance;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.logout = this.logout.bind(this);
    this.clicked = this.clicked.bind(this);
    this.lobbyClicked = this.lobbyClicked.bind(this);
  }

  componentDidMount() {
    this.getPlaylists();
  }

  getPlaylists() {
    const allPlaylists = this.state.allPlaylists;
    this.musicInstance.api.library.playlists({ limit: 200 }).then((response) => {
      const ids = [];
      for (let i = 0; i < response.length; i += 1) {
        const playlist = response[i];
        const obj = {
          name: playlist.attributes.name,
          id: playlist.id.substring(2),
          key: i,
          artwork: window.MusicKit.formatArtworkURL(playlist.attributes.artwork),
        };
        ids.push(response[i].id);
        allPlaylists.push(obj);
      }
      this.setState({ allPlaylists: allPlaylists }, function () {
        fetch(`${process.env.REACT_APP_API_DOMAIN}/getAll`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then(response2 => response2.json()).then((resp) => {
          const lobbies = resp.lobbies;
          const lobbyPlaylists = [];
          const notLobbyPlaylists = [];
          const playlists = this.state.allPlaylists;
          const allFoundPlaylists = playlists.map(x => x.id);

          for (let j = 0; j < allFoundPlaylists.length; j += 1) {
            const id = allFoundPlaylists[j];
            const plist = playlists[j];
            if (lobbies.includes(id)) {
              lobbyPlaylists.push(plist);
            } else {
              notLobbyPlaylists.push(plist);
            }
          }
          this.setState({
            lobbyPlaylists: lobbyPlaylists,
            notLobbyPlaylists: notLobbyPlaylists,
            spinner: false,
          });
        });
      });
    });
  }

  handleSubmit() {
    // send lobby settings in this function
    const temp = document.querySelector('input[name="playlists"]:checked');
    if (temp === null) {
      alert('You must select a playlist!');
    } else if (this.state.name === '') {
      alert('You must enter a name for your lobby!');
    } else {
      fetch(`${process.env.REACT_APP_API_DOMAIN}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          playlistID: temp.value,
          max: this.state.max,
          name: this.state.name,
        }),
      }).then(() => {
        this.props.history.push({
          pathname: `/host/lobby/${temp.value}`,
        });
      });
    }
  }

  handleMax(event) {
    this.setState({ max: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  formatArtworkURL(url, height, width) {
    return this.musicInstance.formatArtworkURL(url, height, width);
  }


  logout() {
    this.musicInstance.unauthorize().then(() => {
      this.props.history.push({
        pathname: '/',
      });
    });
  }

  clicked(id) {
    // remove active from old
    const oldID = this.state.idSelected;
    if (oldID !== 0) document.getElementById(oldID).parentElement.classList.remove('playlistActive');

    document.getElementById(id).parentElement.classList.add('playlistActive');
    document.getElementById(id).checked = true;
    this.setState({ idSelected: id });
  }

  lobbyClicked(id) {
    this.props.history.push({
      pathname: `/host/lobby/${id}`,
    });
  }

  render() {
    let spinner;

    const lobbyPlaylists = [];
    for (let i = 0; i < this.state.lobbyPlaylists.length; i += 1) {
      lobbyPlaylists.push(<LobbyPlaylist
        key={this.state.lobbyPlaylists[i].id}
        playlist={this.state.lobbyPlaylists[i]}
        clickFunc={() => this.lobbyClicked(this.state.lobbyPlaylists[i].id)}
      />);
    }

    const notLobbyPlaylists = [];
    for (let i = 0; i < this.state.notLobbyPlaylists.length; i += 1) {
      notLobbyPlaylists.push(<Playlist
        key={this.state.notLobbyPlaylists[i].id}
        playlist={this.state.notLobbyPlaylists[i]}
        clickFunc={() => this.clicked(this.state.notLobbyPlaylists[i].id)}
      />);
    }

    if (this.state.spinner) {
      spinner = (
        <div className="text-center">
          <div className="spinner" />
        </div>
      );
    } else {
      spinner = (<div />);
    }

    return (
      <div>
        <div className="Top">
          <div className="words">
            {'Select the settings for your Juke Jam party!'}
          </div>
          <div>
            <span className="mr-1">Not your playlists?</span>
            <MiniButton
              clickFunc={this.logout}
              value="Logout"
            />
          </div>
          <hr className="divider4" />
        </div>

        <div className="settingsWords">
          {'Checkout your lobbies:'}
        </div>
        {spinner}
        <div id="playlistsSection">
          <Row>
            {lobbyPlaylists}
          </Row>
        </div>

        <div className="settingsWords">
          {'Select your playlist:'}
        </div>
        {spinner}
        <div id="playlistsSection">
          <Row>
            {notLobbyPlaylists}
          </Row>
        </div>
        <div className="maxRecSection">
          <span className="settingsWords pr-2">
            {'Max recommendations per person:'}
          </span>
          <input className="pl-1" type="number" min="0" max="10" placeholder="0" onChange={this.handleMax} />
          <div id="maxSpan">
            <b>
              {'Note: '}
            </b>
            {'The default value of 0 is no limit.'}
          </div>
          <span className="settingsWords pr-2">
            {'Name of lobby:'}
          </span>
          <input type="text" className="pl-2 textBar" id="nameTextBar" onChange={(event) => { this.handleNameChange(event); }} />
        </div>
        <div className="Bottom">
          <MainButton
            clickFunc={this.handleSubmit}
            value="Submit"
          />
        </div>
      </div>
    );
  }
}

Host.propTypes = {
  musicInstance: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Host);
