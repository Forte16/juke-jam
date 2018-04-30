import React, { Component } from 'react';
import './Home.css'

class Home extends Component {
  constructor(){
    super();
  }
  render() {
    return (
      <div className="main">
        <div className="title"> Juke Jam </div>
        <div className="about">
          Juke Jam is a web application that allows multiple people to seamlessly and in real time add to and alter playlists.
        </div>

          <a href = "http://localhost:8888?host" className="link"><div id="hostButton"> Host </div></a>

          <a href = "http://localhost:8888?guest" className="link"><div id="guestButton"> Guest </div></a>


      </div>
    );
  }
}

export default Home
