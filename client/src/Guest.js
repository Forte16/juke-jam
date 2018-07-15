import React, { Component } from 'react';
import './css/Guest.css';
import SpotifyWebApi from 'spotify-web-api-js';
import socketIOClient from 'socket.io-client';
import GuestSongResults from './GuestSongResults';


const spotifyApi = new SpotifyWebApi();

class Guest extends Component {
  constructor() {
    super();
    function getHashParams() {
      const hashParams = {};
      const r = /([^&;=]+)=?([^&;]*)/g;
      const q = window.location.hash.substring(1);
      let e = r.exec(q);
      while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
      }
      return hashParams;
    }
    const params = getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      change: false,
      code: 'NO CODE',
      currentSongs: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.getTracks = this.getTracks.bind(this);
  }

  getTracks() {
    this.setState({ currentSongs: [] });
    const fillin = document.getElementById('text2').value;
    spotifyApi.searchTracks(fillin)
      .then((response) => {
        const objects = [];
        for (let i = 0; i < response.tracks.items.length; i += 1) {
          const name = response.tracks.items[i].name;
          const artist = response.tracks.items[i].artists[0].name;
          const id = response.tracks.items[i].id;
          const code = this.state.code;
          const obj = {
            name: name, artist: artist, id: id, code: code,
          };
          objects.push(obj);
        }
        this.setState({ currentSongs: objects });
      });
  }

  handleClick() {
    const code = document.getElementById('text1').value;

    if (code.length !== 6) {
      alert('Code is of incorrect length!');
    } else {
      const socket = socketIOClient('http://localhost:5555');

      socket.emit('check lobby', code);

      socket.on('is lobby', (resp) => {
        if (resp.bool) { // if the lobby exists
          this.setState({ change: true });
          this.setState({ code: code });
        } else { // if the lobby doesn't exist
          alert('There is currently not a lobby with this access code.');
        }
        socket.close();
      });
    }
  }

  recommendMe(e) {
    const str = e.target.id;
    const id = str.substring(0, str.indexOf('?'));
    const code = str.substring(str.indexOf('?') + 1);

    const str2 = e.target.name;
    const name = str2.substring(0, str2.indexOf('?'));
    const artist = str2.substring(str2.indexOf('?') + 1);

    const socket = socketIOClient('http://localhost:5555');

    socket.emit('newSong', id, code, function (canRecommend) {
      if (canRecommend) {
        alert(`Your recommendation of ${name} by ${artist} has been sent!`);
      } else {
        alert('ALERT: Your recommendation was not sent. You have exceeeded the maximum number of recommendations.');
      }
      socket.close();
    });
  }

  render() {
    let viewer;

    if (this.state.change) {
      viewer = (
        <div className="main">
          <div className="code">
             Welcome to lobby:
            <span className="code2">
              {this.state.code}
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

    if (!this.state.change) {
      viewer = (
        <div className="main">
          <div id="welcome1">
            Welcome! Please enter your host's code.
          </div>
          <form>
            <input type="text" id="text1" />
            <input type="button" id="btn1" className="customBtn3" value="Submit" onClick={this.handleClick} />
          </form>
        </div>
      );
    }

    return (
      <div>
        { viewer }
      </div>
    );
  }
}


export default Guest;
