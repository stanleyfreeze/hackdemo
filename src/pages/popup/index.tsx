import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Detail from './detail';
import Home from './home';
import './assets/index.less';

const Popup = () => {
  return (
    <Router>
      <Switch>
        <Route path="/detail" component={Detail} />
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
