import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GuestVerify from './routing/GuestVerify';
import EditVerify from './routing/EditVerify';
import About from './presentational/About';
import Mobile from './presentational/Mobile';
import Home from './container/Home';
import HostVerify from './routing/HostVerify';
import LobbyVerify from './routing/LobbyVerify';
import HeaderRoute from './routing/HeaderRoute';
import NotFound from './presentational/NotFound';
import registerServiceWorker from './registerServiceWorker';
import AppleMusicAuth from './AppleMusicAuth';

const music = AppleMusicAuth.sharedProvider();
music.configure().then((resp) => {
  const musicInstance = AppleMusicAuth.getMusicInstance();
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // serve mobile view
    ReactDOM.render(
      <Mobile />,
      document.getElementById('root'),
    );
  } else {
    // serve desktop view
    ReactDOM.render(
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Home musicInstance={musicInstance} />} />
          <HeaderRoute exact path="/host" render={() => <HostVerify musicInstance={musicInstance} />} />
          <HeaderRoute path="/host/lobby" render={() => <LobbyVerify musicInstance={musicInstance} />} />
          <HeaderRoute path="/host/edit" render={() => <EditVerify musicInstance={musicInstance} />} />
          <HeaderRoute path="/recommend" render={() => <GuestVerify musicInstance={musicInstance} />} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </Router>,
      document.getElementById('root'),
    );
  }
});

registerServiceWorker();
