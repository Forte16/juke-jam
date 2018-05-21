import React, { Component } from 'react';
import './GuestSelections.css';
import socketIOClient from 'socket.io-client';

class GuestSelections extends Component {

  recommendMe(e) {
    let str = e.target.id;
    let id = str.substring(0, str.indexOf('?'));
    let code = str.substring(str.indexOf('?')+1);
    const socket = socketIOClient("http://localhost:5555");



    socket.emit('newSong', id, code);

    

    let str2 = e.target.name;
    let name = str2.substring(0, str2.indexOf('?'));
    let artist = str2.substring(str2.indexOf('?')+1);
    alert("Your recommendation of " + name + " by " + artist + " has been sent!");

  }

  render() {




    return (
      <div className="selections">
        {this.props.name + " by " + this.props.artist}
        <input type="button" className="recommendMe customBtn2" name={this.props.name + '?' +  this.props.artist} id={this.props.id + "?" + this.props.code} value='Add' onClick={this.recommendMe}/>
      </div>
    );
  }

}

export default GuestSelections
