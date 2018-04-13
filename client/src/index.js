import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Host from './Host';
import Home from './Home';
import Guest from './Guest';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/host" component={Host} />
        <Route path="/guest" component={Guest} />
      </div>
  </Router>,
  document.getElementById('root')
)
registerServiceWorker();