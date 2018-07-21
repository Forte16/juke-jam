import React, { Component } from 'react';
import './css/Host.css';
import PropTypes from 'prop-types';
import Playlists from './Playlists';
import HostSongResults from './HostSongResults';

class Host extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      playlistID: null,
      limit: 0,
      takeRecommendations: false,
      recommendedSongs: [],
    };
    this.musicInstance = this.props.musicInstance;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refresh = this.refresh.bind(this);
    this.addMe = this.addMe.bind(this);
    this.deleteMe = this.deleteMe.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.getPlaylists();
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


      // send lobby settings below:
    }
  }

  refresh() {
    const playlistID = this.state.playlistID;

    if (this.state.takeRecommendations) {
      fetch('/receive', {
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
  }

  addMe(event, songID, name, artist) {
    const playlistID = this.state.playlistID;
    const tracks = [songID];

    fetch(`https://api.music.apple.com/v1/me/library/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.musicInstance.developerToken}`,
        'Music-User-Token': this.musicInstance.musicUserToken,
      },
      body: {
        data: { 'song': songID },
      },
    }).then(response => response.json())
      .then(resp => console.log(resp));


    // this.musicInstance.api.addToLibrary({ 'songs': [songID] });


    alert(`${name} by ${artist} has been added to your playlist!`);

    // delete the song after adding it
    this.deleteMe(event);
  }

  formatArtworkURL(url, height, width) {
    return this.musicInstance.formatArtworkURL(url, height, width);
  }

  deleteMe(event, songID) {
    const playlistID = this.state.playlistID;
    fetch('/delete', {
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

    // code to delete from frontend -- maybe only delete if know deleted from database
    const parent = event.target.parentElement;
    let temp = parent.firstChild;
    while (temp) {
      parent.removeChild(temp);
      temp = parent.firstChild;
    }
  }

  static getLink() {
    const copyText = document.getElementById('linkInput');
    copyText.select();
    document.execCommand('copy');
  }

  logout() {
    this.musicInstance.unauthorize().then(() => this.forceUpdate());
  }

  render() {
    if (!this.musicInstance.isAuthorized) {
      window.location.reload();
    }

    let viewer;

    if (!this.state.takeRecommendations) {
      viewer = (
        <div className="App">
          <form>
            <div className="Top">
              <div className="words">
                {'Select the settings for your Juke Jam party!'}
              </div>
              <div>
                Not your playlists?
                <span className="customBtn2 logout" onClick={this.logout}>
                  {'Logout'}
                </span>
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
                              {'Note: '}
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
            <div>
              {'Users can send you recommendations at this link:'}
            </div>
            <input type="text" value={`http://localhost:3000/recommend/${this.state.playlistID}`} id="linkInput" readonly />
            <div onClick={Host.getLink}>
              {'Copy link'}
            </div>
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
