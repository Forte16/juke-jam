import React from 'react';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

const GuestSongResults = ({ currentSongs, recommendMe }) => (
  <div className="songsGuest">
    {currentSongs.map(song => (
      <div className="selections" key={song.id}>
        {`${song.name} by ${song.artist}`}
        <input type="button" className="recommendMe customBtn2" value="Add" onClick={() => recommendMe(song.id, song.name, song.artist)} />
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
