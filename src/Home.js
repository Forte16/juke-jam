import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import co from 'co';
import PropTypes from 'prop-types';
import Host from './Host';
import './css/Home.css';
import './css/tailwind.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false,
    };
    this.musicInstance = this.props.musicInstance;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.goToLobby = this.goToLobby.bind(this);
    this.joinLobby = this.joinLobby.bind(this);
  }

  componentDidMount() {
    if (this.musicInstance.isAuthorized) {
      this.setState({ authorized: true});
    }
  }

  login() {
    const that = this;
    co(function* () {
      const key = yield that.musicInstance.authorize();
      if (key) {
        that.setState({ authorized: true });
      }
    });
  }

  logout() {
    this.musicInstance.unauthorize().then(() => this.forceUpdate());
  }

  goToLobby() {
    this.props.history.push({
      pathname: '/host',
    });
  }

  joinLobby() {
    const code = document.getElementById('lobbyText').value;
    this.props.history.push({
      pathname: `/recommend/${code}`,
    });
  }

  render() {
    let buttonDiv;
    if (this.musicInstance.isAuthorized) {
      buttonDiv = (
        <div>
          <input type="button" id="hostButton" value="Get Started" onClick={this.goToLobby} />
          <div>
            <input type="button" value="Logout" className="customBtn2 logout" onClick={this.logout} />
          </div>
        </div>
      );
    } else {
      buttonDiv = (
        <div>
          <input type="button" id="hostButton" value="Login" onClick={this.login} />
        </div>
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
        { buttonDiv }
        <div>
          <input type="text" id="lobbyText" />
          <input type="button" value="Join" className="customBtn2 logout" onClick={this.joinLobby} />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  musicInstance: PropTypes.object.isRequired,
};


export default withRouter(Home);
