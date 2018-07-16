import React, { Component } from 'react';
import './css/Host.css';
import SpotifyWebApi from 'spotify-web-api-js';
import socketIOClient from 'socket.io-client';
import Playlists from './Playlists';
import HostSongResults from './HostSongResults';

const spotifyApi = new SpotifyWebApi();

class Host extends Component {
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
      loggedIn: token,
      playlists: [],
      autoAdd: false,
      limit: 0,
      code: 0,
      playlistID: null,
      takeRecommendations: false,
      recommendedSongs: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refresh = this.refresh.bind(this);
    this.addMe = this.addMe.bind(this);
    this.deleteMe = this.deleteMe.bind(this);
    this.findDetails = this.findDetails.bind(this);
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      this.getPlaylists();
    }
  }

  getPlaylists() {
    spotifyApi.getUserPlaylists()
      .then((response) => {
        const playlists1 = [];
        for (let i = 0; i < response.items.length; i += 1) {
          const obj = {
            name: response.items[i].name,
            id: response.items[i].id,
            key: i,
            images: response.items[i].images,
            tracks: response.items[i].tracks,
          };
          playlists1.push(obj);
        }
        this.setState({ playlists: playlists1 });
      });
  }

  handleCheckBoxChange() {
    const auto = this.state.autoAdd;
    this.setState({ autoAdd: !auto });
  }

  handleChange(event) {
    this.setState({ limit: event.target.value });
  }

  handleSubmit() {
    const temp = document.querySelector('input[name="playlists"]:checked');
    if (temp === null) {
      alert('You must select a playlist!');
    } else {
      this.setState({ playlistID: temp.value });
      this.setState({ takeRecommendations: true });
      this.setState({ code: temp.value.substring(0, 6) });

      const code = temp.value.substring(0, 6);
      const limit = this.state.limit;

      const socket = socketIOClient('http://localhost:5555');

      socket.emit('host settings', code, limit, function () {
        socket.close();
      });
    }
  }


  refresh() {
    // eslint-disable-next-line
    Array.prototype.diff = function(a) {
      return this.filter(function (i) { return a.indexOf(i) < 0; });
    };

    const socket = socketIOClient('http://localhost:5555');

    socket.emit('refresh', this.state.code);

    if (this.state.takeRecommendations) {
      socket.on('recommended', (resp) => {
        if (resp.list) {
          const songs = [];
          for (let i = 0; i < resp.list.length; i += 1) {
            const songID = resp.list[i];
            spotifyApi.getTrack(songID)
              .then((response) => {
                const name = response.name;
                const artist = response.artists[0].name;
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
        socket.close();
      });
    }
  }

  addMe(event, songID, name, artist) {
    const uris = [`spotify:track:${songID}`];

    spotifyApi.getMe()
      .then((response) => {
        const userID = response.id;
        spotifyApi.addTracksToPlaylist(userID, this.state.playlistID, uris);
      });

    alert(`${name} by ${artist} has been added to your playlist!`);

    // delete the song after adding it
    this.deleteMe(event);
  }

  deleteMe(event, songID) {
    // code to delete from server
    const socket = socketIOClient('http://localhost:5555');
    socket.emit('delete song', this.state.code, songID, function () {
      socket.close();
    });

    // code to delete from frontend
    const parent = event.target.parentElement;
    let temp = parent.firstChild;
    while (temp) {
      parent.removeChild(temp);
      temp = parent.firstChild;
    }
  }

  findDetails(songID) {
    spotifyApi.getTrack(songID)
      .then((response) => {
        const name = response.name;
        const artist = response.artists[0].name;
        return [name, artist];
      });
  }


  render() {
    let viewer;

    if (!this.state.takeRecommendations) {
      viewer = (
        <div className="App">
          <form>
            <div className="Top">
              <div className="words">
                {'Select the settings for your Juke Jam party!'}
              </div>
              <hr className="divider4" />
            </div>

            <div className="Middle">
              <div className="settingsWords">
                {'Select your playlist:'}
              </div>
              <Playlists playlists={this.state.playlists} />

              <div className="maxRecSection">
                <span className="settingsWords">
                  {'Max recommendations per person:'}
                </span>
                <table>
                  <tbody>
                    <tr>

                      <td>
                        <select id="select" className="form-control" onChange={this.handleChange}>
                          <option value={0}>
                            {'0'}
                          </option>
                          <option value={1}>
                            {'1'}
                          </option>
                          <option value={2}>
                            {'2'}
                          </option>
                          <option value={3}>
                            {'3'}
                          </option>
                          <option value={4}>
                            {'4'}
                          </option>
                          <option value={5}>
                            {'5'}
                          </option>
                          <option value={6}>
                            {'6'}
                          </option>
                          <option value={7}>
                            {'7'}
                          </option>
                          <option value={8}>
                            {'8'}
                          </option>
                          <option value={9}>
                            {'9'}
                          </option>
                          <option value={10}>
                            {'10'}
                          </option>
                        </select>
                      </td>
                      <td>
                        <p id="maxSpan">
                          <b>
                            <i>
                              {'Note:'}
                            </i>
                          </b>
                          {'The default value of 0 is no limit.'}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>

          <div className="Bottom">
            <button type="submit" onClick={this.handleSubmit} value="Submit" className="customBtn" id="btn">
              {'Submit'}
            </button>
          </div>
        </div>
      );
    }

    if (this.state.takeRecommendations) {
      viewer = (
        <div>
          <div className="code">
            {'Your lobby\'s code:'}
            <span className="code2">
              {this.state.code}
            </span>
          </div>
          <hr className="divider" />
          <div className="topPart">
            {'Recommended songs from your friends:'}
          </div>

          <HostSongResults
            recommendedSongs={this.state.recommendedSongs}
            addMe={this.addMe}
            deleteMe={this.deleteMe}
            code={this.state.code}
          />

          <div className="socketBtnDiv">
            <input className="customBtn" type="button" value="Refresh" onClick={this.refresh} />
          </div>
        </div>

      );
    }

    return (
      <div>
        {viewer}
      </div>
    );
  }
}

export default Host;
