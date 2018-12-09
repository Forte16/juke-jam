import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../css/Host.css';
import '../css/tailwind.css';
import PropTypes from 'prop-types';
import MainButton from '../presentational/MainButton';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      max: this.props.max,
    };
    this.updateSettings = this.updateSettings.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMax = this.handleMax.bind(this);
  }

  updateSettings() {
    const playlistID = this.props.playlistID;
    fetch(`${process.env.REACT_APP_API_DOMAIN}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        playlistID: playlistID,
        name: this.state.name,
        max: this.state.max,
      }),
    }).then((resp) => {
      if (resp.status === 200) {
        alert('Your settings have been updated!');
      } else {
        alert('Something went wrong...');
      }
    });
  }

  handleMax(event) {
    this.setState({ max: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="text-center">
          <div>
            {this.props.playlistTitle}
          </div>
          <img className="cover" src={this.props.playlistArtwork} alt="" />
        </div>
        <div>
          <span>Name: </span>
          <input type="text" className="pl-2 textBar" value={this.state.name} id="nameTextBar" onChange={(event) => { this.handleNameChange(event); }} />
        </div>
        <div>
          <input className="pl-1" type="number" min="0" max="10" value={this.state.max} onChange={this.handleMax} />
        </div>
        <div className="Bottom">
          <MainButton
            clickFunc={this.updateSettings}
            value="Submit"
          />
        </div>
      </div>
    );
  }
}

Edit.propTypes = {
  playlistID: PropTypes.string.isRequired,
  playlistTitle: PropTypes.string.isRequired,
  playlistArtwork: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
};

export default withRouter(Edit);
