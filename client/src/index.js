import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Guest from './container/Guest';
import About from './presentational/About';
import Home from './container/Home';
import Host from './container/Host';
import Lobby from './container/Lobby';
import registerServiceWorker from './registerServiceWorker';
import AppleMusicAuth from './AppleMusicAuth';

const music = AppleMusicAuth.sharedProvider();
music.configure();
const musicInstance = AppleMusicAuth.getMusicInstance();

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" render={() => <Home musicInstance={musicInstance} />} />
      <Route exact path="/host" render={() => <Host musicInstance={musicInstance} />} />
      <Route path="/host/lobby" render={() => <Lobby musicInstance={musicInstance} />} />
      <Route path="/recommend" render={() => <Guest musicInstance={musicInstance} />} />
      <Route path="/about" component={About} />
    </div>
  </Router>,
  document.getElementById('root'),
);
registerServiceWorker();
