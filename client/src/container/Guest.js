import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import GuestSongResult from '../presentational/GuestSongResult';
import SearchBar from '../presentational/SearchBar';
import '../css/Guest.css';
import '../css/tailwind.css';

class Guest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSongs: [],
      noResults: false,
      spinner: false,
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
    if (!fillin) return;

    this.setState({ noResults: false });
    this.setState({ currentSongs: [] });
    this.setState({ spinner: true });

    this.musicInstance.api.search(fillin, { limit: 20, types: 'songs' })
      .then((response) => {
        this.setState({ spinner: false });
        if (response.songs === undefined) {
          this.setState({ noResults: true });
          return;
        }
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
    const playlistID = this.props.playlistID;
    fetch(`${process.env.REACT_APP_API_DOMAIN}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    }).then((resp) => {
      if (resp.status === 200) {
        alert(`Your recommendation of ${name} by ${artist} has been sent!`);
      } else if (resp.status === 409) {
        alert(`Your recommendation of ${name} by ${artist} has already been recommended.`);
      } else if (resp.status === 429) {
        alert('Sorry, you have reached the maximum number of recommendations for this lobby.');
      }
    });
  }

  render() {
    let noResults;
    let spinner;

    if (this.state.noResults) {
      noResults = (
        <div>
          {'Sorry no results were found.'}
        </div>
      );
    } else {
      noResults = (<div />);
    }

    if (this.state.spinner) {
      spinner = (
        <div className="text-center">
          <div className="spinner" />
        </div>
      );
    } else {
      spinner = (<div />);
    }

    return (
      <div className="text-center">
        <div>
          <div className="italic">
            {'you are recommending songs for'}
          </div>
          <div className="lobbyName">
            { this.props.name }
          </div>
        </div>
        <div className="searchWords">
         Search for a track you'd like to recommend below:
        </div>
        <SearchBar
          clickFunc={this.getTracks}
          textbarID="text2"
          value="Search"
        />
        {noResults}
        {spinner}
        <div className="songsGuest">
          {this.state.currentSongs.map(song => (
            <GuestSongResult
              key={song.id}
              song={song}
              recommendMe={this.recommendMe}
            />
          ))}
        </div>
      </div>
    );
  }
}

Guest.propTypes = {
  musicInstance: PropTypes.object.isRequired,
  playlistID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};


export default withRouter(Guest);
