import Link from 'react-router';
import React, { Component } from 'react';
import './Host.css';
import SpotifyWebApi from 'spotify-web-api-js';


const spotifyApi = new SpotifyWebApi();

class Host extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      playlists: []
    }
    this.getFinalPlaylist = this.getFinalPlaylist.bind(this)
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
  getPlaylists(){
  spotifyApi.getUserPlaylists()
    .then((response) => {
       let playlists1 = []
       for (let i=0; i< response.items.length; i++) {
          let obj = {name: response.items[i].name, id: response.items[i].id, key: i};
          playlists1.push(obj);
        }
        this.setState({playlists: playlists1});
      }
    )
  }
  getFinalPlaylist(){
  spotifyApi.getPlaylist()
    .then((response) => {
        console.log(response);
      }
    )
  }
  componentDidMount() {
    if (this.state.loggedIn) {
      this.getPlaylists();
    }
  }
  render() {
    const top = this.state.loggedIn ? <div> Choose a playlist from below: </div> : <a href='http://localhost:8888'> Login to Spotify </a>
    return (
      <div className="App">
        {top}
        <div>
        <ul>
         {this.state.playlists.map(function(playlist, i){
           return <a key={playlist.key} href={"lobbyhost/"+playlist.id}> <li key={playlist.key} id={playlist.id}> {playlist.name} </li> </a>
         })}
        </ul>
        </div>
      </div>
    );
  }
}

export default Host;
