import React, { Component } from 'react';
import './css/Guest.css';
import PropTypes from 'prop-types';
import GuestSongResults from './GuestSongResults';

// Code for getting playlistID from URL -- should find better way
const url = window.location.href;
const index = window.location.href.indexOf('mend/');
const idURL = url.substring(index + 5);

class Guest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistID: idURL,
      currentSongs: [],
    };
    this.musicInstance = this.props.musicInstance;
    this.getTracks = this.getTracks.bind(this);
    this.recommendMe = this.recommendMe.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleEnterPress);
  }

  getTracks() {
    const fillin = document.getElementById('text2').value;
    this.musicInstance.api.search(fillin, { limit: 20, types: 'songs' })
      .then((response) => {
        const objects = [];
        for (let i = 0; i < response.songs.data.length; i += 1) {
          const name = response.songs.data[i].attributes.name;
          const artist = response.songs.data[i].attributes.artistName;
          const id = response.songs.data[i].id;
          const code = this.state.code;
          const obj = {
            name: name, artist: artist, id: id, code: code,
          };
          objects.push(obj);
        }
        this.setState({ currentSongs: objects });
      });
  }

  handleEnterPress(event) {
    if (event.key === 'Enter') {
      this.getTracks();
    }
  }

  recommendMe(songID, name, artist) {
    const playlistID = this.state.playlistID;
    fetch('/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    }).then(alert(`Your recommendation of ${name} by ${artist} has been sent!`));
  }

  render() {
    return (
      <div className="main">
        <div className="code">
           Welcome to lobby:
          <span className="code2">
            {this.state.playlistID}
          </span>
        </div>
        <hr className="divider" />
        <div className="searchWords">
         Search for a track you'd like to recommend below:
        </div>
        <input type="text" id="text2" />
        <input type="button" id="btn2" className="customBtn3" value="Submit" onClick={this.getTracks} />

        <GuestSongResults currentSongs={this.state.currentSongs} recommendMe={this.recommendMe} />

      </div>
    );
  }
}

Guest.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};


export default Guest;
