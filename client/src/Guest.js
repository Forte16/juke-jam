import React, { Component } from 'react';
import './css/Guest.css';
import GuestSelections from './GuestSelections.js';
import SpotifyWebApi from 'spotify-web-api-js';
import socketIOClient from 'socket.io-client';


const spotifyApi = new SpotifyWebApi();

/*
  File: Guest.js - Style: Guest.css

  Notes:

*/


class Guest extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      theView: 0,
      change: false,
      code: "NO CODE",
      currentSongs: []
    };
    this.handleClick = this.handleClick.bind(this)
    this.getTracks = this.getTracks.bind(this)
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  handleClick() {
    let code = document.getElementById('text1').value;

    if (code.length !== 6) {
      alert("Code is of incorrect length!");
    } else {
      const socket = socketIOClient("http://localhost:5555");

      socket.emit('check lobby', code);

      socket.on('is lobby', (resp) => {
        if (resp.bool) { //if the lobby exists
          this.setState({change: true});
          this.setState({code: code});
        } else { //if the lobby doesn't exist
          alert("There is currently not a lobby with this access code.")
        }
        socket.close();
      })


    }


  }

  getTracks(){
    this.setState({currentSongs: []});
    let fillin = document.getElementById('text2').value;
    spotifyApi.searchTracks(fillin)
      .then((response) => {
        let objects = []
        for (let i=0; i< response.tracks.items.length; i++) {
          let name = response.tracks.items[i].name;
          let artist = response.tracks.items[i].artists[0].name;
          let id = response.tracks.items[i].id;
          let code = this.state.code;
          let obj = {name: name, artist: artist, id: id, code: code};
          objects.push(obj);
        }
        this.setState({currentSongs: objects});
      }
    )
  }



  render() {
    let viewer;

    if (this.state.change) {
      viewer = (
         <div className="main">
           <div className="code">
             Welcome to lobby: <span className="code2"> {this.state.code} </span>
           </div>
           <hr className="divider"/>

           <div className="searchWords">
           Search for a track you'd like to recommend below:
           </div>


           <input type="text" id="text2"/>
           <input type="button" id="btn2" className="customBtn3"  value="Submit" onClick={this.getTracks}/>

           <div className="songsGuest">
              {this.state.currentSongs.map(function(song, i){
                return(
                  <GuestSelections code={song.code} name={song.name} artist={song.artist} id={song.id} key={i}/>
                )
              })}
           </div>

         </div>
       )
    }

   if (!this.state.change) {
     viewer = (
       <div className="main">
         <div id="welcome1"> Welcome! Please enter your host's code. </div>
         <form>
          <input type="text" id="text1"/>
          <input type="button" id="btn1" className="customBtn3" value="Submit" onClick={this.handleClick}/>
         </form>
       </div>
     );
   }

    return (
        <div>
          { viewer }
        </div>
    )
  }
}



export default Guest
