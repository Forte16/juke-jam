import React from 'react';
import PropTypes from 'prop-types';
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
      <div className="center pb-1">
        <input className="mdBtn" type="button" value="Go" onClick={() => clickFunc(playlist.id)} />
        <input className="mdBtn" type="button" value="Edit" onClick={() => editFunc(playlist.id)} />
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
