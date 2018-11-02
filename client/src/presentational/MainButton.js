import React from 'react';
import PropTypes from 'prop-types';
import '../css/tailwind.css';
import '../css/index.css';

const MainButton = props => (
  <input className="mainBtn rounded" type="button" value={props.value} onClick={props.clickFunc} />
);


MainButton.propTypes = {
  value: PropTypes.string.isRequired,
  clickFunc: PropTypes.func.isRequired,
};

export default MainButton;
