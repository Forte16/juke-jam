import React, { Component } from 'react';
import './css/Host.css';
import SpotifyWebApi from 'spotify-web-api-js';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import Playlists from './Playlists';
import HostSongResults from './HostSongResults';

const spotifyApi = new SpotifyWebApi();

class Host extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      autoAdd: false,
      limit: 0,
      playlistID: null,
      takeRecommendations: false,
      recommendedSongs: [],
    };
    this.musicInstance = this.props.musicInstance;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refresh = this.refresh.bind(this);
    this.addMe = this.addMe.bind(this);
    this.deleteMe = this.deleteMe.bind(this);
    this.findDetails = this.findDetails.bind(this);
  }

  componentDidMount() {
    this.getPlaylists()
  }

  getPlaylists() {
    this.musicInstance.api.library.playlists()
    .then((response) => {
      const playlists1 = [];
      for (let i = 0; i < response.length; i += 1) {
        const obj = {
          name: response[i].attributes.name,
          id: response[i].id,
          key: i,
          artwork: response[i].attributes.artwork.url,
        };
        playlists1.push(obj);
      }
      this.setState({ playlists: playlists1 });
    });
  }
    /*
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
      */

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

      const limit = this.state.limit;

      const socket = socketIOClient('http://localhost:5555');

      socket.emit('host settings', this.state.playlistID, limit, function () {
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

    socket.emit('refresh', this.state.playlistID);

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
    socket.emit('delete song', this.state.playlistID, songID, function () {
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
            <a href={`localhost:3000/recommend/${this.state.playlistID}`}>
            <span className="code2">
              {this.state.playlistID}
            </span>
          </a>
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

    return (
      <div>
        {viewer}
      </div>
    );
  }
}

Host.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};

export default Host;
