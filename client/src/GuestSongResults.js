import React from 'react';
import PropTypes from 'prop-types';
import './css/Guest.css';

const GuestSongResults = props => (
  <div className="songsGuest">
    {props.currentSongs.map(song => (
      <div className="selections" key={song.id}>
        {`${song.name} by ${song.artist}`}
        <input type="button" className="recommendMe customBtn2" value="Add" onClick={() => props.recommendMe(song.id, song.name, song.artist)} />
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
