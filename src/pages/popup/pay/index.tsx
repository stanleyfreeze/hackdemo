import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from '@/pages/popup/components/nav';

import Style from '../assets/index.less';

export default function () {
  const history = useHistory();

  useEffect(() => {}, []);
  return (
    <div className={`${Style.content} ${Style.pay}`}>
      <div className={`${Style.inputs}`}>
        <input type="text" />
        <input type="text" />
      </div>
      <button
        className={`${Style.button}`}
        onClick={() => {
          history.push(`/`);
        }}
      ></button>
      <Nav />
    </div>
  );
}
