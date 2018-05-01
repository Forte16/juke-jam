import React, { Component } from 'react';
import './GuestSelections.css';
import socketIOClient from 'socket.io-client';

class GuestSelections extends Component {

  recommendMe(e) {
    let str = e.target.id;
    let id = str.substring(0, str.indexOf('?'));
    let code = str.substring(str.indexOf('?')+1);
    const socket = socketIOClient("http://localhost:5555")  // this is where we are connecting to with sockets

    // this emits an event to the socket (your server) with an argument of 'red'
    // you can make the argument any color you would like, or any kind of data you want to send.

    socket.emit('newSong', id, code);
    // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments

    let str2 = e.target.name;
    let name = str2.substring(0, str2.indexOf('?'));
    let artist = str2.substring(str2.indexOf('?')+1);
    alert("Your recommendation of " + name + " by " + artist + " has been sent!");

  }

  render() {




    return (
      <div className="selections">
        {this.props.name + " by " + this.props.artist}
        <input type="button" className="recommendMe" name={this.props.name + '?' +  this.props.artist} id={this.props.id + "?" + this.props.code} value='&#10004;' onClick={this.recommendMe}/>
      </div>
    );
  }

}

export default GuestSelections

/*
let id = e.target.id

var myHeaders = new Headers();
myHeaders.append('Content-Type', 'text/xml');

var myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'no-cors',
           cache: 'default'
          };

const myRequest = new Request('http://localhost:8888/recommend', myInit);

  fetch(myRequest)
    .then(response => {
      console.log(response);
    });
    */
