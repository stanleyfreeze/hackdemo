import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ROUTES } from '@/utils/enum';
import PersonalInfo from './personalInfo';
import Equipment from './equipment';
import Backpack from './backpack';
import Base from './base';
import Reward from './reward';
import Task from './task';
import TaskDetail from './task/detail';
import TaskPublish from './task/publish';
import TrainingInstitute from './trainingInstitute';
import Treasure from './treasure';
import Warehouse from './warehouse';
import ComingSoon from './comingSoon';
import Pay from './pay';

import Home from './home';

const Popup = () => {
  return (
    <Router>
      <Switch>
        <Route path={`/${ROUTES.PERSONAL_INFO}`} component={PersonalInfo} />
        <Route path={`/${ROUTES.EQUIPMENT}`} component={Equipment} />
        <Route path={`/${ROUTES.BACKPACK}`} component={Backpack} />
        <Route path={`/${ROUTES.BASE}`} component={Base} />
        <Route path={`/${ROUTES.REWARD}`} component={Reward} />
        <Route path={`/${ROUTES.TASK}`} component={Task} />
        <Route path={`/${ROUTES.TASK_DETAIL}`} component={TaskDetail} />
        <Route path={`/${ROUTES.TASK_PUBLISH}`} component={TaskPublish} />
        <Route path={`/${ROUTES.TRAINING_INSTITUTE}`} component={TrainingInstitute} />
        <Route path={`/${ROUTES.TREASURE}`} component={Treasure} />
        <Route path={`/${ROUTES.WAREHOUSE}`} component={Warehouse} />
        <Route path={`/${ROUTES.PAY}`} component={Pay} />
        <Route path={`/${ROUTES.COMING_SOON}`} component={ComingSoon} />
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
