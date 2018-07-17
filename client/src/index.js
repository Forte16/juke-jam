import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Host from './Host';
import Home from './Home';
import Guest from './Guest';
import About from './About';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/host" component={Host} />
      <Route path="/guest" component={Guest} />
      <Route path="/about" component={About} />
    </div>
  </Router>,
  document.getElementById('root'),
);
registerServiceWorker();
