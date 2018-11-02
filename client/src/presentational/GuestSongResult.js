import React from 'react';
import PropTypes from 'prop-types';
import MiniButton from './MiniButton';
import '../css/Guest.css';
import '../css/tailwind.css';

const GuestSongResult = ({ song, recommendMe }) => (
  <div className="selections" key={song.id}>
    <span className="mr-2">{`${song.name} by ${song.artist}`}</span>
    <MiniButton
      value="Add"
      clickFunc={() => recommendMe(song.id, song.name, song.artist)}
    />
  </div>
);


GuestSongResult.propTypes = {
  song: PropTypes.object.isRequired,
  recommendMe: PropTypes.func.isRequired,
};

export default GuestSongResult;
