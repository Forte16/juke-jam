import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../css/Host.css';
import PropTypes from 'prop-types';
import MainButton from '../presentational/MainButton';
import CopyBar from '../presentational/CopyBar';
import RecommendedSong from '../presentational/RecommendedSong';
import '../css/tailwind.css';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistID: '',
      recommendedSongs: [],
      spinner: true,
    };
    this.musicInstance = this.props.musicInstance;
    this.refresh = this.refresh.bind(this);
    this.addMe = this.addMe.bind(this);
    this.deleteMe = this.deleteMe.bind(this);
  }

  componentDidMount() {
    this.setState({ playlistID: this.props.playlistID }, function () {
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
    this.setState({ spinner: true });

    fetch(`${process.env.REACT_APP_API_DOMAIN}/receive`, {
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
        if (resp.list.length === 0) {
          this.setState({
            recommendedSongs: [],
            spinner: false,
          });
          return;
        }
        this.musicInstance.api.songs(resp.list).then((songs) => {
          const recommendedSongs = [];
          for (let i = 0; i < songs.length; i += 1) {
            const name = songs[i].attributes.name;
            const artist = songs[i].attributes.artistName;
            const songID = songs[i].id;
            const pushMe = {
              name: name,
              artist: artist,
              songID: songID,
            };
            recommendedSongs.push(pushMe);
          }
          this.setState({
            recommendedSongs: recommendedSongs,
            spinner: false,
          });
        });
      });
  }

  deleteMe(event, songID) {
    const that = this;
    const playlistID = this.state.playlistID;

    // mark as deleted in database and update UI
    fetch(`${process.env.REACT_APP_API_DOMAIN}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    }).then(() => that.refresh());
  }

  addMe(event, songID, name, artist) {
    const that = this;
    const playlistID = this.state.playlistID;

    // mark as added in database and update UI
    fetch(`${process.env.REACT_APP_API_DOMAIN}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        songID: songID,
        playlistID: playlistID,
      }),
    }).then(() => that.refresh());

    const data = {
      'data': [
        {
          'id': songID,
          'type': 'songs',
        },
      ],
    };

    // add the song to the user's playlist
    fetch(`https://api.music.apple.com/v1/me/library/playlists/p.${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.musicInstance.developerToken}`,
        'Music-User-Token': this.musicInstance.musicUserToken,
      },
      body: JSON.stringify(data),
    });

    alert(`${name} by ${artist} has been added to your playlist!`);
  }

  render() {
    let max;
    let songs;
    if (this.props.max > 0) {
      max = `Max recommendations per person: ${this.props.max}`;
    } else {
      max = 'No limit set for max recommendations per person.';
    }

    if (this.state.spinner) {
      songs = (
        <div className="text-center">
          <div className="spinner" />
        </div>
      );
    } else if (this.state.recommendedSongs.length === 0) {
      songs = 'No songs have been recommended yet.';
    } else {
      songs = [];
      for (let i = 0; i < this.state.recommendedSongs.length; i += 1) {
        const song = this.state.recommendedSongs[i];
        songs.push(
          <RecommendedSong
            key={song.songID}
            addMe={this.addMe}
            deleteMe={this.deleteMe}
            song={song}
          />,
        );
      }
    }

    return (
      <div>
        <div className="code">
          <div>
            {'Friends can send you recommendations at this link:'}
          </div>
          <CopyBar
            textbarID="linkInput"
            textbarValue={`${process.env.REACT_APP_URL}/recommend/${this.state.playlistID}`}
            clickFunc={Lobby.getLink}
            value="Copy"
          />
          <div className="text-sm italic">
            {max}
          </div>
        </div>
        <hr className="divider" />
        <div className="text-center mt-6">
          <div className="italic">
            {'recommended songs for'}
          </div>
          <div className="lobbyName">
            { this.props.name }
          </div>
        </div>
        <div className="recommendedSongs">
          {songs}
        </div>
        <div className="text-center mt-4">
          <MainButton
            clickFunc={this.refresh}
            value="Refresh"
          />
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  musicInstance: PropTypes.object.isRequired,
  playlistID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
};

export default withRouter(Lobby);
