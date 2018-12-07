import React from 'react';
import PropTypes from 'prop-types';
import '../css/tailwind.css';
import '../css/index.css';

const CopyBar = props => (
  <div>
    <input type="text" value={props.textbarValue} className="pl-2 textBar" id={props.textbarID} readOnly />
    <input className="mdBtn" type="button" value={props.value} onClick={props.clickFunc} />
  </div>
);

CopyBar.propTypes = {
  textbarID: PropTypes.string.isRequired,
  clickFunc: PropTypes.func.isRequired,
  textbarValue: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default CopyBar;
