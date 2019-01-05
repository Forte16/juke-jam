import React from 'react';
import '../css/index.css';
import '../css/tailwind.css';
import PropTypes from 'prop-types';

const Scroller = ({ components }) => (
  <div className="scroller">
    {components}
  </div>
);

Scroller.propTypes = {
  components: PropTypes.array.isRequired,
};

export default Scroller;
