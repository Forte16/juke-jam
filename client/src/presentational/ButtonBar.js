import React from 'react';
import PropTypes from 'prop-types';
import '../css/tailwind.css';
import '../css/index.css';

const ButtonBar = props => (
  <div>
    <input type="text" value={props.textbarValue} className="pl-2 textBar" id={props.textbarID} readOnly={props.readOnly} />
    <input className="mdBtn" type="button" value={props.value} onClick={props.clickFunc} />
  </div>
);


ButtonBar.propTypes = {
  textbarID: PropTypes.string.isRequired,
  clickFunc: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

ButtonBar.defaultProps = {
  textbarValue: undefined,
  readOnly: false,
};


export default ButtonBar;
