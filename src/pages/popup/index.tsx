import Style from '@/styles/index.less';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Detail from './detail';

const Popup = () => {
  return (
    <Router>
      <div className={Style.popup}>
        <div className={Style.content}>
          Hack Demo
          <Link to="/detail">Detail</Link>
        </div>
      </div>
      <Switch>
        <Route path="/detail">
          <Detail />
        </Route>
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
