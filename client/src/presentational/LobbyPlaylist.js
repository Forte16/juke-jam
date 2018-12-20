import React from 'react';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const LobbyPlaylist = ({ playlist, clickFunc, editFunc }) => (
  <Col className="lobbyPlaylist" key={playlist.id}>
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
  </Col>
);

LobbyPlaylist.propTypes = {
  playlist: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
  editFunc: PropTypes.func.isRequired,
};

export default LobbyPlaylist;
