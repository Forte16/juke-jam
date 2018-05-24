import React, { Component } from 'react';
import './GuestSelections.css';
import socketIOClient from 'socket.io-client';

class GuestSelections extends Component {
  constructor(){
    super();
    this.recommendMe = this.recommendMe.bind(this)
  }

  recommendMe(e) {
    let str = e.target.id;
    let id = str.substring(0, str.indexOf('?'));
    let code = str.substring(str.indexOf('?')+1);

    let str2 = e.target.name;
    let name = str2.substring(0, str2.indexOf('?'));
    let artist = str2.substring(str2.indexOf('?')+1);



    const socket = socketIOClient("http://localhost:5555");



    //socket.emit('newSong', id, code);
    socket.emit('newSong', id, code, function(canRecommend){
      if (canRecommend) {
        alert("Your recommendation of " + name + " by " + artist + " has been sent!");
      } else {
        alert("ALERT: Your recommendation was not sent. You have exceeeded the maximum number of recommendations.")
      }
      socket.close();
    });

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
