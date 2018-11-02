import React from 'react';
import PropTypes from 'prop-types';
import MiniButton from '../presentational/MiniButton';
import '../css/Guest.css';
import '../css/tailwind.css';

const GuestSongResults = ({ currentSongs, recommendMe }) => (
  <div className="songsGuest">
    {currentSongs.map(song => (
      <div className="selections" key={song.id}>
        <span className="mr-2">{`${song.name} by ${song.artist}`}</span>
        <MiniButton
          value="Add"
          clickFunc={() => recommendMe(song.id, song.name, song.artist)}
        />
      </div>
    ))
  }
  </div>
);


GuestSongResults.propTypes = {
  currentSongs: PropTypes.array.isRequired,
  recommendMe: PropTypes.func.isRequired,
};

export default GuestSongResults;
