import React from 'react';
import PropTypes from 'prop-types';
import MainButton from './MainButton';
import MiniButton from './MiniButton';
import '../css/Guest.css';
import '../css/tailwind.css';

const LobbyPlaylist = ({ playlist, clickFunc, editFunc }) => (
  <div className="lobbyPlaylist" key={playlist.id}>
    <span>
      <img className="cover" src={playlist.artwork} alt="" />
      <div className="playlistName">
        &#9835;
        {` ${playlist.name}`}
      </div>
      <div className="center -mb-8">
        <div>
          <MainButton
            clickFunc={() => clickFunc(playlist.id)}
            value="Go"
          />
        </div>
        <div>
          <MiniButton
            clickFunc={() => editFunc(playlist.id)}
            value="Edit"
          />
        </div>
      </div>
    </span>
  </div>
);

LobbyPlaylist.propTypes = {
  playlist: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
  editFunc: PropTypes.func.isRequired,
};

export default LobbyPlaylist;
