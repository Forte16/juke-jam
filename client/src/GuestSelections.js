import React, { Component } from 'react';
import './GuestSelections.css'

class GuestSelections extends Component {
  constructor() {
    super();

  }

  recommendMe(e) {
    alert(e.target.id);
  }

  render() {
    return (
      <div className="selections">
        {this.props.name + " by " + this.props.artist}
        <input type="button" className="recommendMe" id={this.props.id} onClick={this.recommendMe}/>
      </div>
    );
  }

}

export default GuestSelections
