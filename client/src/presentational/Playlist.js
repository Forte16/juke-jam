import React from 'react';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const Playlist = ({ playlist }) => (
  <Col className="playlist" key={playlist.id}>
    <input type="radio" name="playlists" className="buttons" value={playlist.id} />
    <span className="playlistLeft">
      <img className="cover" src={playlist.artwork} alt="" />
    </span>
    <span className="playlistRight">
      <div className="playlistRightInners">
        &#9835;
        {` ${playlist.name}`}
      </div>
      <div className="playlistRightInners italicize">
        {` ${playlist.tracks} tracks`}
      </div>
    </span>
  </Col>
);

Playlist.propTypes = {
  playlist: PropTypes.object.isRequired,
};

export default Playlist;
