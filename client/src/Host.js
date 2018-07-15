import React, { Component } from 'react';
import './css/Host.css';
import SpotifyWebApi from 'spotify-web-api-js';
import socketIOClient from 'socket.io-client';

import emptyPic from './pics/empty.png';

import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

/*
  File: Host.js - Style: Host.css

  Notes:
  1. Spotify Web API Link: https://github.com/JMPerez/spotify-web-api-js/blob/master/src/spotify-web-api.js
*/

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

      let code = temp.value.substring(0, 6);
      let limit = this.state.limit;

      const socket = socketIOClient("http://localhost:5555");

      socket.emit('host settings', code, limit, function() {
        socket.close();
      });




    }

  }


  refresh() {
    //eslint-disable-next-line
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    }

    const socket = socketIOClient("http://localhost:5555");

    socket.emit('refresh', this.state.code);

    if (this.state.takeRecommendations) {
      socket.on('recommended', (resp) => {
        if (typeof resp.list !== "undefined") {
          this.setState({recommendedSongs: resp.list})
        }
        socket.close();
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





            <div className = "settingsWords">
              Select your playlist:
            </div>


            <div id="playlistsSection">
            <Row>
               {this.state.playlists.map(function(playlist, i){
                 let x = typeof playlist.images[0] === "undefined" ? emptyPic : playlist.images[0].url;
                 return (
                  <Col className="playlist" key={i}>
                    <input type="radio" name="playlists" className="buttons" value={playlist.id}/>
                    <span className="playlistLeft">
                      <img className="cover" src = {x} alt=""/>
                    </span>
                    <span className="playlistRight">
                       <div className="playlistRightInners"> &#9835; {playlist.name} </div>
                      <div className="playlistRightInners"> <i>{playlist.tracks.total} songs</i> </div>
                     </span>
                    </Col>
                  )
                })}
              </Row>
              </div>

              <div className = "maxRecSection">
                <span className = "settingsWords">
                Max recommendations per person:
                </span>
                <table>
                <tbody>
                <tr>

                <td>
                  <select id="select" className="form-control" onChange={this.handleChange}>
                    <option value={0}>0</option> <option value={1}>1</option>
                    <option value={2}>2</option> <option value={3}>3</option>
                    <option value={4}>4</option> <option value={5}>5</option>
                    <option value={6}>6</option> <option value={7}>7</option>
                    <option value={8}>8</option> <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                </td>
                <td>
                <p id="maxSpan"> <b><i> Note: </i> </b> The default value of 0 is no limit. </p>
                </td>

                </tr>
                </tbody>
                </table>
              </div>


              </div>

            </form>


          <div className= "Bottom">
            <button type="submit" onClick={this.handleSubmit} className="customBtn" id="btn">Submit</button>
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
            <input className="customBtn" type="button" value='Refresh' onClick={this.refresh}/>
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
    this.deleteMe = this.deleteMe.bind(this)
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

    //delete the song after adding it
    this.deleteMe(e);
  }

  deleteMe(e) {
    //code to delete from server
    let str = e.target.id;
    let playlistID = str.substring(0, 6);
    let songID = str.substring(str.indexOf('?')+1);


    const socket = socketIOClient("http://localhost:5555");
    socket.emit('delete song', playlistID, songID, function() {
      socket.close();
    });


    //code to delete from frontend
    let parent = e.target.parentElement;

    let temp = parent.firstChild;

    while(temp) {
        parent.removeChild(temp);
        temp = parent.firstChild;
    }

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
        <input type="button" value='Add' className="recommendMe customBtn2" id={this.props.playlistID + "?" + this.props.songID} onClick={this.addMe}/>
        <input type="button" value='Delete' className="deleteMe customBtn2" id={this.props.playlistID + "?" + this.props.songID} onClick={this.deleteMe}/>
      </div>
    );
  }

}

export default Host;
