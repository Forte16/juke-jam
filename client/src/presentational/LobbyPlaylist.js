import React from 'react';
import PropTypes from 'prop-types';
import MainButton from './MainButton';
import '../css/Guest.css';
import '../css/tailwind.css';
import editSVG from '../assets/edit.svg';

const LobbyPlaylist = ({ playlist, clickFunc, editFunc }) => (
  <div className="lobbyPlaylist" key={playlist.id}>
    <span>
      <img className="cover" src={playlist.artwork} alt="" />
      <img className="editSVG" src={editSVG} title="Edit Settings" alt="Edit Settings" onClick={() => editFunc(playlist.id)} />
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
