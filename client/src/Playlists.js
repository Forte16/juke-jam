import React from 'react';
import PropTypes from 'prop-types';
import './css/Guest.css';

import { Row, Col } from 'react-bootstrap';
import emptyPic from './pics/empty.png';
import 'bootstrap/dist/css/bootstrap.css';

const Playlists = props => (
  <div id="playlistsSection">
    <Row>
      {props.playlists.map(function (playlist) {
        const x = typeof playlist.images[0] === 'undefined' ? emptyPic : playlist.images[0].url;
        return (
          <Col className="playlist" key={playlist.id}>
            <input type="radio" name="playlists" className="buttons" value={playlist.id} />
            <span className="playlistLeft">
              <img className="cover" src={x} alt="" />
            </span>
            <span className="playlistRight">
              <div className="playlistRightInners">
                &#9835;
                {` ${playlist.name}`}
              </div>
              <div className="playlistRightInners">
                <i>
                  {`${playlist.tracks.total} songs`}
                </i>
              </div>
            </span>
          </Col>
        );
      })}
    </Row>
  </div>
);

Playlists.propTypes = {
  playlists: PropTypes.array.isRequired,
};

export default Playlists;
