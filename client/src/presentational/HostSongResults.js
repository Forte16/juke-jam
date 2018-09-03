import React from 'react';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

const HostSongResults = ({ addMe, deleteMe, recommendedSongs }) => (
  <div className="recommendedSongs">
    {recommendedSongs.map(song => (
      <div className="selections" key={song.songID}>
        {`${song.name} by ${song.artist}`}
        <input type="button" value="Add" className="recommendMe customBtn2" onClick={event => addMe(event, song.songID, song.name, song.artist)} />
        <input type="button" value="Delete" className="deleteMe customBtn2" onClick={event => deleteMe(event, song.songID)} />
      </div>
    ))}
  </div>
);

HostSongResults.propTypes = {
  recommendedSongs: PropTypes.array,
  addMe: PropTypes.func.isRequired,
  deleteMe: PropTypes.func.isRequired,
};

HostSongResults.defaultProps = {
  recommendedSongs: [],
};

export default HostSongResults;
