import React, { Component } from 'react';
import './Guest.css';
import GuestSelections from './GuestSelections.js';
import SpotifyWebApi from 'spotify-web-api-js';


const spotifyApi = new SpotifyWebApi();


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
    if (code.length !== 22) {
      alert("Code is of incorrect length!");
    } else {
      this.setState({change: true});
      this.setState({code: code});
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
          let obj = {name: name, artist: artist, id: id};
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
           <div>
             Welcome to lobby {this.state.code}!
           </div>

           <input type="text" id="text2"/>
           <input type="button" id="btn2" value="Submit" onClick={this.getTracks}/>

           <div>
              {this.state.currentSongs.map(function(song, i){
                return(
                  <GuestSelections name={song.name} artist={song.artist} id={song.id} key={i}/>
                )
              })}
           </div>

         </div>
       )
    }

   if (!this.state.change) {
     viewer = (
       <div className="main">
         <div> Welcome! Please enter your host's code. </div>
         <form>
         <input type="text" id="text1"/>
         <input type="button" id="btn1" value="Submit" onClick={this.handleClick}/>
           </form>
       </div>);
     }

    return (
        <div>
          { viewer }
        </div>
    )
  }
}



export default Guest
