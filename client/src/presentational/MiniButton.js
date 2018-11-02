import React from 'react';
import PropTypes from 'prop-types';
import '../css/tailwind.css';
import '../css/index.css';

const MiniButton = props => (
  <input className="miniBtn rounded" type="button" value={props.value} onClick={props.clickFunc} />
);


MiniButton.propTypes = {
  value: PropTypes.string.isRequired,
  clickFunc: PropTypes.func.isRequired,
};

export default MiniButton;
