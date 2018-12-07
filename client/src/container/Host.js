import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../css/Host.css';
import '../css/tailwind.css';
import PropTypes from 'prop-types';
import MainButton from '../presentational/MainButton';
import MiniButton from '../presentational/MiniButton';
import Playlist from '../presentational/Playlist';

class Host extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      max: 0,
      idSelected: 0,
      name: '',
    };
    this.musicInstance = this.props.musicInstance;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.logout = this.logout.bind(this);
    this.clicked = this.clicked.bind(this);
  }

  componentDidMount() {
    if (this.musicInstance.isAuthorized) {
      this.getPlaylists();
    } else {
      this.props.history.push({
        pathname: '/',
      });
    }
  }

  getPlaylists() {
    this.musicInstance.api.library.playlists()
      .then((response) => {
        const ids = [];
        for (let i = 0; i < response.length; i += 1) {
          ids.push(response[i].id);
        }
        for (let i = 0; i < response.length; i += 1) {
          this.musicInstance.api.library.playlist(ids[i])
            .then((playlist) => {
              const obj = {
                name: playlist.attributes.name,
                id: playlist.id.substring(2),
                key: i,
                artwork: window.MusicKit.formatArtworkURL(playlist.attributes.artwork),
                tracks: playlist.relationships.tracks.data.length,
              };
              this.setState({ playlists: [...this.state.playlists, obj] }); // eslint-disable-line
            });
        }
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

  render() {
    if (!this.musicInstance.isAuthorized) {
      // send them back to host
    }

    const playlists = [];
    for (let i = 0; i < this.state.playlists.length; i += 1) {
      playlists.push(<Playlist
        key={this.state.playlists[i].id}
        playlist={this.state.playlists[i]}
        clickFunc={() => this.clicked(this.state.playlists[i].id)}
      />);
    }

    return (
      <div>
        <form>
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

          <div className="Middle">
            <div className="settingsWords">
              {'Select your playlist:'}
            </div>

            <div id="playlistsSection">
              <Row>
                {playlists}
              </Row>
            </div>
            <div className="maxRecSection">
              <span className="settingsWords">
                {'Max recommendations per person:'}
              </span>
              <table>
                <tbody>
                  <tr>

                    <td>
                      <select id="select" onChange={this.handleMax} className="form-control">
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
              <span className="settingsWords">
                {'Name of lobby:'}
              </span>
              <div>
                <input type="text" className="ml-4 pl-2 textBar" id="nameTextBar" onChange={(event) => { this.handleNameChange(event); }} />
              </div>
            </div>
          </div>
        </form>
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
