import React, { Component } from 'react';
import co from 'co';
import PropTypes from 'prop-types';
import Host from './Host';
import './css/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
    this.musicInstance = this.props.musicInstance;
    this.login = this.login.bind(this);
  }

  login() {
    const that = this;
    co(function* () {
      const key = yield that.musicInstance.authorize();
      if (key) {
        that.setState({ isLoggedIn: true });
      }
    });
  }

  render() {
    if (this.musicInstance.isAuthorized) {
      return (
        <Host musicInstance={this.musicInstance} />
      );
    }
    return (
      <div className="main">
        <div className="title">
          Juke Jam
        </div>
        <div className="about">
          Juke Jam is a web application that allows users to easily receive recommendations
           for music at social events, and effortlessly add the suggestions to their party playlist.
        </div>
        <div className="center">
          <a href="/about" className="goToWebsite">
            Click here to learn more.
          </a>
        </div>
        <div id="hostButton" onClick={this.login}>
            Host
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};


export default Home;
