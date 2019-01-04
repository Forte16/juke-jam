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
        this.props.history.push({
          pathname: '/host',
        });
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
        <div className="editContainer">
          <div className="text-center">
            <div className="italic mt-5">
              {'update lobby settings for playlist'}
            </div>
            <div className="code2 mt mb-8">
              {this.props.playlistTitle}
            </div>
          </div>
          <div className="ml-5">
            <span>
              {'Lobby name:'}
            </span>
            <input type="text" className="pl-2 ml-3 textBar" value={this.state.name} id="nameTextBar" onChange={(event) => { this.handleNameChange(event); }} />
          </div>
          <div className="ml-5">
            <span>
              {'Max recommendations:'}
            </span>
            <input id="numberPicker" className="ml-3" type="number" min="0" max="10" value={this.state.max} onChange={this.handleMax} />
          </div>
          <div className="text-center mt-8">
            <MainButton
              clickFunc={this.updateSettings}
              value="Update"
            />
          </div>
        </div>
      </div>
    );
  }
}

Edit.propTypes = {
  playlistID: PropTypes.string.isRequired,
  playlistTitle: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Edit);
