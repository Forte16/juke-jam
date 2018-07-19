import React, { Component } from 'react';
import { Redirect } from 'react-router';
import co from 'co';
import Host from './Host';
import './css/Home.css';

class TestHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
    this.musicInstance = this.props.musicInstance;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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

  logout() {
    this.musicInstance.unauthorize();
  }

  render() {

    if (this.state.isLoggedIn) {
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
        <a onClick={this.login}>
          <div id="hostButton">
            Host
          </div>
        </a>
        <a onClick={this.logout}> Hi
        </a>
      </div>
    );
  }
}


export default TestHome;
