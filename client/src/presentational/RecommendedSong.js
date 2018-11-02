import React from 'react';
import PropTypes from 'prop-types';
import MiniButton from './MiniButton';
import '../css/Guest.css';
import '../css/tailwind.css';

const HostSongResults = ({ addMe, deleteMe, song }) => (
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
);

HostSongResults.propTypes = {
  song: PropTypes.object,
  addMe: PropTypes.func.isRequired,
  deleteMe: PropTypes.func.isRequired,
};

HostSongResults.defaultProps = {
  song: {},
};

export default HostSongResults;
