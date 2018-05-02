import React, { Component } from 'react';
import './Host.css';
import SpotifyWebApi from 'spotify-web-api-js';
import socketIOClient from 'socket.io-client';


const spotifyApi = new SpotifyWebApi();

const socket = socketIOClient("http://localhost:5555")

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
      code: 0,
      takeRecommendations: false,
      recommendedSongs: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.refresh = this.refresh.bind(this)
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
      this.setState({code: temp.value.substring(0, 6)})
    }
  }

  refresh() {

    socket.emit('addSong', this.state.code, this.state.limit);

    if (this.state.takeRecommendations) {
      socket.on('recommended', (resp) => {
        if (typeof resp.list !== "undefined") {
          this.setState({recommendedSongs: resp.list})
        }
      })
    }

  }

  render() {
    let viewer;
    let playlistID = this.state.playlistID;

    if (!this.state.takeRecommendations) {
      viewer = (
        <div className="App">
          <form>
          <div className="Top">
            <div className="words">
              Select the settings for your Juke Jam party!
            </div>
            <hr className="divider4"/>
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
        <div>
          <div className="code">
            Your lobby's code: <span className="code2"> {this.state.code} </span>
          </div>
          <hr className="divider"/>
          <div className="topPart">
            Recommended songs from your friends:
          </div>
          <div className="recommendedSongs">
             {this.state.recommendedSongs.map(function(songID, i){
               return(
                 <Song playlistID={playlistID} key={i} songID={songID}/>
               )
             })}
          </div>
          <div className="socketBtnDiv">
            <input type="button" className="socketBtn" value='Refresh' onClick={this.refresh}/>
          </div>
        </div>

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
    this.state = {
      name: "",
      artist: ""
    }
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.findDetails = this.findDetails.bind(this)
    this.addMe = this.addMe.bind(this)
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

    spotifyApi.getMe()
      .then((response) => {
          let userID = response.id;
          spotifyApi.addTracksToPlaylist(userID, playlistID, uris);
        }
      )

    alert(this.state.name + " by " + this.state.artist + " has been added to your playlist!");
  }

  findDetails(e) {
    spotifyApi.getTrack(e)
      .then((response) => {
        let name = response.name;
        let artist = response.artists[0].name;
        this.setState({name: name, artist: artist});
      })
  }

  componentWillMount() {
    this.findDetails(this.props.songID);
  }


  render() {

    return (
      <div className="selections">
        {this.state.name + " by " + this.state.artist}
        <input type="button" value='Add' className="recommendMe" id={this.props.playlistID + "?" + this.props.songID} onClick={this.addMe}/>
      </div>
    );
  }

}

export default Host;
