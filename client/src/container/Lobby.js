import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../css/Host.css';
import PropTypes from 'prop-types';
import MainButton from '../presentational/MainButton';
import ButtonBar from '../presentational/ButtonBar';
import RecommendedSong from '../presentational/RecommendedSong';
import '../css/tailwind.css';

class Lobby extends Component {
  static deleteFrontend(event) {
    // code to delete from frontend
    const parent = event.target.parentElement;
    let temp = parent.firstChild;
    while (temp) {
      parent.removeChild(temp);
      temp = parent.firstChild;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      playlistID: '',
      recommendedSongs: [],
    };
    this.musicInstance = this.props.musicInstance;
    this.refresh = this.refresh.bind(this);
    this.addMe = this.addMe.bind(this);
    this.deleteMe = this.deleteMe.bind(this);
    this.checkLobby = this.checkLobby.bind(this);
  }

  componentDidMount() {
    // Code for getting playlistID from URL
    const url = window.location.href;
    const index = window.location.href.indexOf('obby/');
    const idURL = url.substring(index + 5);
    this.setState({ playlistID: idURL }, function () {
      this.refresh();
      this.checkLobby();
    });
  }

  static getLink() {
    const copyText = document.getElementById('linkInput');
    copyText.select();
    document.execCommand('copy');
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
        that.props.history.push({
          pathname: '/',
        });
      }
    });
  }

  refresh() {
    const playlistID = this.state.playlistID;

    fetch(`${process.env.REACT_APP_API_DOMAIN}/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        playlistID: playlistID,
      }),
    }).then(response => response.json())
      .then((resp) => {
        this.musicInstance.api.songs(resp.list).then((songs) => {
          const recommendedSongs = [];
          for (let i = 0; i < songs.length; i += 1) {
            const name = songs[i].attributes.name;
            const artist = songs[i].attributes.artistName;
            const songID = songs[i].id;
            const pushMe = {
              name: name,
              artist: artist,
              songID: songID,
            };
            recommendedSongs.push(pushMe);
          }
          this.setState({ recommendedSongs: recommendedSongs });
        });
      });
  }

  deleteMe(event, songID) {
    const that = this;
    const playlistID = this.state.playlistID;

    // mark as deleted in database and update UI
    fetch(`${process.env.REACT_APP_API_DOMAIN}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    }).then(() => that.refresh());
  }

  addMe(event, songID, name, artist) {
    const that = this;
    const playlistID = this.state.playlistID;

    // mark as added in database and update UI
    fetch(`${process.env.REACT_APP_API_DOMAIN}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    }).then(() => that.refresh());

    const data = {
      'data': [
        {
          'id': songID,
          'type': 'songs',
        },
      ],
    };

    // add the song to the user's playlist
    fetch(`https://api.music.apple.com/v1/me/library/playlists/p.${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.musicInstance.developerToken}`,
        'Music-User-Token': this.musicInstance.musicUserToken,
      },
      body: JSON.stringify(data),
    });

    alert(`${name} by ${artist} has been added to your playlist!`);
  }

  render() {
    return (
      <div>
        <div className="code">
          <div>
            {'Users can send you recommendations at this link:'}
          </div>
          <ButtonBar
            textbarID="linkInput"
            textbarValue={`${process.env.REACT_APP_API_DOMAIN}/recommend/${this.state.playlistID}`}
            clickFunc={Lobby.getLink}
            readOnly
            value="Copy"
          />
        </div>
        <hr className="divider" />
        <div className="topPart">
          {'Recommended songs from your friends:'}
        </div>
        <div className="recommendedSongs">
          {this.state.recommendedSongs.map(song => (
            <RecommendedSong
              key={song.songID}
              addMe={this.addMe}
              deleteMe={this.deleteMe}
              song={song}
            />
          ))}
        </div>
        <div className="text-center mt-4">
          <MainButton
            clickFunc={this.refresh}
            value="Refresh"
          />
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};

export default withRouter(Lobby);
