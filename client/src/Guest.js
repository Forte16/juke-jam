import Link from 'react-router';
import React, { Component } from 'react';
import './Guest.css';
import SpotifyWebApi from 'spotify-web-api-js';


const spotifyApi = new SpotifyWebApi();

class Guest extends Component {
  handleClick() {
    let code = document.getElementById('text').value;
    if (code.length != 22) {
      alert("Code is of incorrect length!");
    } else {
      window.open('http://localhost:3000/lobby/' + code, "_self");
    }
  }
  render() {
    return (
      <div className="main">
        <div> Welcome! Please enter your host's code. </div>
        <form>
        <input type="text" id="text"/>
        <input type="button" id="btn" value="Submit" onClick={this.handleClick}/>
          </form>
      </div>
    )
  }
}

export default Guest
