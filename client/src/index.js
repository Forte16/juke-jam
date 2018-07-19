import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Host from './Host';
import Guest from './Guest';
import About from './About';
import Home from './Home';
import registerServiceWorker from './registerServiceWorker';
import AppleMusicAuth from './AppleMusicAuth';

const music = AppleMusicAuth.sharedProvider();
music.configure();
const musicInstance = AppleMusicAuth.getMusicInstance();

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" render={(props) => ( <Home musicInstance={musicInstance}/> )} />
      <Route path="/host" component={Host} />
      <Route path="/recommend" render={(props) => ( <Guest musicInstance={musicInstance}/> )} />
      <Route path="/about" component={About} />
    </div>
  </Router>,
  document.getElementById('root'),
);
registerServiceWorker();
