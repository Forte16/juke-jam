import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Guest from './container/Guest';
import About from './presentational/About';
import Mobile from './presentational/Mobile';
import Home from './container/Home';
import Host from './container/Host';
import Lobby from './container/Lobby';
import NotFound from './presentational/NotFound';
import registerServiceWorker from './registerServiceWorker';
import AppleMusicAuth from './AppleMusicAuth';

const music = AppleMusicAuth.sharedProvider();
music.configure();
const musicInstance = AppleMusicAuth.getMusicInstance();

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
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
        <Route exact path="/host" render={() => <Host musicInstance={musicInstance} />} />
        <Route path="/host/lobby" render={() => <Lobby musicInstance={musicInstance} />} />
        <Route path="/recommend" render={() => <Guest musicInstance={musicInstance} />} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Router>,
    document.getElementById('root'),
  );
}

registerServiceWorker();
