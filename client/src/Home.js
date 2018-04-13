import Link from 'react-router-dom';
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
        <div className="about"> Juke Jam is a web application that blah blah blah....</div>

          <a href = "http://localhost:8888" className="link"><div id="hostButton"> Host </div></a>

          <a href = "/guest" className="link"><div id="guestButton"> Guest </div></a>

      </div>
    );
  }
}

export default Home
