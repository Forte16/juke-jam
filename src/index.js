import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Guest from './Guest';
import About from './About';
import Home from './Home';
import Host from './Host';
import Lobby from './Lobby';
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
