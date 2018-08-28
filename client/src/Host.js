import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './css/Host.css';
import './css/tailwind.css';
import PropTypes from 'prop-types';
import Playlists from './Playlists';

class Host extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      limit: 0,
    };
    this.musicInstance = this.props.musicInstance;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
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
                id: playlist.id,
                key: i,
                artwork: window.MusicKit.formatArtworkURL(playlist.attributes.artwork),
                tracks: playlist.relationships.tracks.data.length,
              };
              this.setState({ playlists: [...this.state.playlists, obj] });
            });
        }
      });
  }

  handleChange(event) {
    this.setState({ limit: event.target.value });
  }

  handleSubmit() {
    // send lobby settings in this function
    const temp = document.querySelector('input[name="playlists"]:checked');
    if (temp === null) {
      alert('You must select a playlist!');
    } else {
      this.props.history.push({
        pathname: `/host/lobby/${temp.value}`,
      });
    }
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

  render() {
    if (!this.musicInstance.isAuthorized) {
      // send them back to host
    }

    if (this.state.submit) {
      // send to lobby with this.state.playlistID
    }

    return (
      <div>
        <form>
          <div className="Top">
            <div className="words">
              {'Select the settings for your Juke Jam party!'}
            </div>
            <div>
              {'Not your playlists?'}
              <input type="button" value="Logout" className="customBtn2 logout" onClick={this.logout} />
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
}

Host.propTypes = {
  musicInstance: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Host);
