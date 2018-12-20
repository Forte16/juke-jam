import React from 'react';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const Playlist = ({ playlist, clickFunc }) => (
  <Col className="playlist" key={playlist.id} onClick={e => clickFunc(e, playlist.id)}>
    <input id={playlist.id} type="radio" name="playlists" className="buttons hidden" value={playlist.id} />
    <span>
      <img className="cover" src={playlist.artwork} alt="" />
      <div className="playlistName">
        &#9835;
        {` ${playlist.name}`}
      </div>
    </span>
  </Col>
);

Playlist.propTypes = {
  playlist: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
};

export default Playlist;
