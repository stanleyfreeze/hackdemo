import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '@/utils/enum';
import Nav from '@/pages/popup/components/nav';
import Style from '../assets/index.less';

export default function Equipment() {
  const history = useHistory();

  useEffect(() => {}, []);
  return (
    <div
      className={`${Style.content} ${Style.comingSoon}`}
      onClick={() => {
        history.push(`/`);
      }}
    >
      <div
        className={`${Style.title}`}
        // onClick={() => {
        //   history.push(`/${ROUTES.EQUIPMENT}`);
        // }}
      >
        COMING SOON...
      </div>
      <Nav />
    </div>
  );
}
