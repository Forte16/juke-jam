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
      playlists: [],
      autoAdd: false,
      limit: 0,
      playlistID: 0,
      takeRecommendations: false
    }
    this.getFinalPlaylist = this.getFinalPlaylist.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
           let obj = {name: response.items[i].name, id: response.items[i].id, key: i, images: response.items[i].images, tracks: response.items[i].tracks};
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

  handleCheckBoxChange(event) {
    this.setState({autoAdd : !this.state.autoAdd})
  }
  handleChange(event) {
    this.setState({limit: event.target.value})
  }

  handleSubmit() {
    let temp = document.querySelector('input[name="playlists"]:checked');
    if (temp === null) {
      alert("You must select a playlist!");
    } else {
      this.setState({playlistID: temp.value});
      this.setState({takeRecommendations: true});
    }
    console.log(this.state.limit);
  }

  render() {
    let viewer;

    if (!this.state.takeRecommendations) {
      viewer = (
        <div className="App">
          <form>
          <div className="Top">
            <div className="words">
              Select the settings for your Juke Jam party!
            </div>
            <hr className="divider"/>
          </div>

          <div className="Middle">
              <div className = "BigLeft">
                 {this.state.playlists.map(function(playlist, i){
                   return (
                    <div className="playlist" key={i}>
                     <input type="radio" name="playlists" className="buttons" value={playlist.id}/>
                        <div className="left">
                          <img id="cover" src = {playlist.images[0].url}/>
                        </div>
                        <div className ="right">
                          <p>
                           &#9835; {playlist.name} <br/>
                           <i>{playlist.tracks.total} songs</i>
                           </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className = "BigRight">
                  Automatically add songs:
                  <input name="autoAddSongs" type="checkbox" checked={this.state.autoAdd} onChange={this.handleCheckBoxChange} />
                  <br/>
                  <br />
                  Max recommendations per person (default 0 = no limit):
                  <select onChange={this.handleChange}>
                    <option value={0}>0</option> <option value={1}>1</option>
                    <option value={2}>2</option> <option value={3}>3</option>
                    <option value={4}>4</option> <option value={5}>5</option>
                    <option value={6}>6</option> <option value={7}>7</option>
                    <option value={8}>8</option> <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                </div>

              </div>
            </form>
          <div className= "Bottom">
            <button type="submit" onClick={this.handleSubmit} id="btn">Create your Juke Jam party</button>
          </div>

        </div>
      )
    }

    if (this.state.takeRecommendations) {
      viewer = (
        <Song name="Nice for What" artist="Drake" playlistID={this.state.playlistID} songID="1cTZMwcBJT0Ka3UJPXOeeN"/>
      )
    }

    return (
      <div>
        {viewer}
      </div>
    );
  }
}

class Song extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
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

  addMe(e) {
    let str = e.target.id;
    let playlistID = str.substring(0, str.indexOf('?'));
    let songID = str.substring(str.indexOf('?')+1);
    let uris = ["spotify:track:"+ songID];
    console.log(str);
    console.log(playlistID);
    console.log(songID);

    spotifyApi.getMe()
      .then((response) => {
          let userID = response.id;
          spotifyApi.addTracksToPlaylist(userID, playlistID, uris);
        }
      )
  }

  render() {
    return (
      <div className="add">
        {this.props.name + " by " + this.props.artist}
        <input type="button" className="recommendMe" id={this.props.playlistID + "?" + this.props.songID} onClick={this.addMe}/>
      </div>
    );
  }

}

export default Host;
