import React, { Component } from 'react';
import '../css/Host.css';
import '../css/tailwind.css';
import PropTypes from 'prop-types';
import HostSongResults from '../presentational/HostSongResults';

class Lobby extends Component {
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
    this.deleteDatabase = this.deleteDatabase.bind(this);
    this.deleteFrontend = this.deleteFrontend.bind(this);
  }

  componentDidMount() {
    // Code for getting playlistID from URL
    const url = window.location.href;
    const index = window.location.href.indexOf('obby/');
    const idURL = url.substring(index + 5);
    this.setState({ playlistID: idURL }, function () {
      this.refresh();
    });
  }

  static getLink() {
    const copyText = document.getElementById('linkInput');
    copyText.select();
    document.execCommand('copy');
  }

  refresh() {
    const playlistID = this.state.playlistID;

    fetch('http://localhost:5555/receive', {
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
        if (resp.list) {
          const songs = [];
          for (let i = 0; i < resp.list.length; i += 1) {
            const songID = resp.list[i];
            this.musicInstance.api.song(songID)
              .then((response) => {
                const name = response.attributes.name;
                const artist = response.attributes.artistName;
                const pushMe = {
                  name: name,
                  artist: artist,
                  songID: songID,
                };
                songs.push(pushMe);
                this.setState({ recommendedSongs: songs });
              // aware this couldn't be dumber, will fix on Apple Music conversion
              });
          }
        }
      });
  }

  deleteDatabase(songID) {
    const playlistID = this.state.playlistID;
    return fetch('http://localhost:5555/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    });
  }

  static deleteFrontend(event) {
    // code to delete from frontend
    const parent = event.target.parentElement;
    let temp = parent.firstChild;
    while (temp) {
      parent.removeChild(temp);
      temp = parent.firstChild;
    }
  }

  deleteMe(event, songID) {
    this.deleteDatabase(songID).then(this.deleteFrontend(event));
  }

  addMe(event, songID, name, artist) {
    const playlistID = this.state.playlistID;

    fetch(`https://api.music.apple.com/v1/me/library/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.musicInstance.developerToken}`,
        'Music-User-Token': this.musicInstance.musicUserToken,
      },
      body: {
        'data': [{
          'id': songID,
          'type': 'library-songs',
        }],
      },
    }).then(response => response.json())
      .then(resp => console.log(resp));

    alert(`${name} by ${artist} has been added to your playlist!`);

    // delete the song after adding it
    this.deleteMe(event);
  }

  render() {
    return (
      <div>
        <div className="code">
          <div>
            {'Users can send you recommendations at this link:'}
          </div>
          <input type="text" value={`http://localhost:3000/recommend/${this.state.playlistID}`} id="linkInput" readOnly />
          <input type="button" value="Copy link" onClick={Lobby.getLink} />
        </div>
        <hr className="divider" />
        <div className="topPart">
          {'Recommended songs from your friends:'}
        </div>

        <HostSongResults
          recommendedSongs={this.state.recommendedSongs}
          addMe={this.addMe}
          deleteMe={this.deleteMe}
          playlist={this.state.playlist}
        />

        <div className="socketBtnDiv">
          <input className="customBtn" type="button" value="Refresh" onClick={this.refresh} />
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};

export default Lobby;
