import React, { Component } from 'react';
import './css/Guest.css';
import SpotifyWebApi from 'spotify-web-api-js';
import socketIOClient from 'socket.io-client';
import GuestSongResults from './GuestSongResults';


const spotifyApi = new SpotifyWebApi();

const url = window.location.href;
const index = window.location.href.indexOf('mend/');
const me = url.substring(index+5);

class Guest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      change: false,
      playlistID: me,
      currentSongs: [],
    };
    this.musicInstance = this.props.musicInstance;
    this.getTracks = this.getTracks.bind(this);
    this.recommendMe = this.recommendMe.bind(this);
  }

  getTracks() {
    // can get more from 'next' in response
    const fillin = document.getElementById('text2').value;
    this.musicInstance.api.search(fillin)
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

  recommendMe(id, name, artist) {
    const socket = socketIOClient('http://localhost:5555');

    socket.emit('newSong', id, this.state.playlistID, function (canRecommend) {
      if (canRecommend) {
        alert(`Your recommendation of ${name} by ${artist} has been sent!`);
      } else {
        alert('ALERT: Your recommendation was not sent. You have exceeeded the maximum number of recommendations.');
      }
      socket.close();
    });
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


export default Guest;
