import React from 'react';
import MiniButton from '../presentational/MiniButton';
import PropTypes from 'prop-types';
import '../css/Guest.css';
import '../css/tailwind.css';

const HostSongResults = ({ addMe, deleteMe, recommendedSongs }) => (
  <div className="recommendedSongs">
    {recommendedSongs.map(song => (
      <div className="selections" key={song.songID}>
        {`${song.name} by ${song.artist}`}
        <span className="ml-2 mr-1">
          <MiniButton
            value="Add"
            clickFunc={event => addMe(event, song.songID, song.name, song.artist)}
          />
        </span>
        <span>
          <MiniButton
            value="Delete"
            clickFunc={event => deleteMe(event, song.songID)}
          />
        </span>
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
