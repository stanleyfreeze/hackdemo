import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from '@/pages/popup/components/nav';

import Style from '../assets/index.less';

export default function Equipment() {
  const history = useHistory();

  useEffect(() => {}, []);
  return (
    <div className={`${Style.content} ${Style.equipment}`}>
      <Nav />
    </div>
  );
}
