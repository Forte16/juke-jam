import React from 'react';
import PropTypes from 'prop-types';
import './css/Guest.css';

const HostSongResults = props => (
  <div className="recommendedSongs">
    {props.recommendedSongs.map(song => (
      <div className="selections" key={song.songID}>
        {`${song.name} by ${song.artist}`}
        <input type="button" value="Add" className="recommendMe customBtn2" id={`${props.code}?${song.songID}`} onClick={(event) => props.addMe(event, song.songID, song.name, song.artist)} />
        <input type="button" value="Delete" className="deleteMe customBtn2" id={`${props.code}?${song.songID}`} onClick={(event) => props.deleteMe(event, song.songID)} />
      </div>
    ))}
  </div>
);

HostSongResults.propTypes = {
  recommendedSongs: PropTypes.array.isRequired,
  code: PropTypes.string.isRequired,
  addMe: PropTypes.func.isRequired,
  deleteMe: PropTypes.func.isRequired,
};

export default HostSongResults;
