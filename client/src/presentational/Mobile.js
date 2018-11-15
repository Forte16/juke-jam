import React from 'react';
import '../css/tailwind.css';

const mobileStyle = {
  marginTop: '200px',
};

const Mobile = () => (
  <div>
    <div className="text-2xl text-center" style={mobileStyle}>
      {'iOS App Coming Soon!'}
    </div>
    <div className="text-l text-center mt-6">
      {'Check out the web experience on a non-mobile computer.'}
    </div>
  </div>
);

export default Mobile;
