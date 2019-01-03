import React from 'react';
import PropTypes from 'prop-types';
import '../css/tailwind.css';
import '../css/index.css';

const SearchBar = props => (
  <div>
    <input type="text" className="pl-2 textBar textBarForSearch" id={props.textbarID} />
    <input className="mdBtn" type="button" value={props.value} onClick={props.clickFunc} />
  </div>
);

SearchBar.propTypes = {
  textbarID: PropTypes.string.isRequired,
  clickFunc: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchBar;
