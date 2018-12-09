import React from 'react';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const LobbyPlaylist = ({ playlist, clickFunc, editFunc }) => (
  <Col className="playlist" key={playlist.id}>
    <span className="playlistLeft">
      <img className="cover" src={playlist.artwork} alt="" />
    </span>
    <span className="playlistRight">
      <div className="playlistRightInners">
        &#9835;
        {` ${playlist.name}`}
      </div>
      <div>
        <input className="mdBtn" type="button" value="Go" onClick={() => clickFunc(playlist.id)} />
      </div>
      <div>
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
