import React, { Component } from 'react';
import './css/Home.css';

class Home extends Component {
  render() {
    return (
      <div className="main">
        <div className="title"> Juke Jam </div>
        <div className="about">
          Juke Jam is a web application that allows users to easily receive recommendations for music at social events, and effortlessly add the suggestions to their party playlist.
        </div>
        <div className="center">
          <a href="/about" className="goToWebsite"> Click here to learn more. </a>
        </div>

          <a href = "http://localhost:8888?host" className="link"><div id="hostButton"> Host </div></a>

          <a href = "http://localhost:8888?guest" className="link"><div id="guestButton"> Guest </div></a>


      </div>
    );
  }
}

export default Home
