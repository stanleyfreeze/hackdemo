import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '@/utils/enum';
import Style from '../assets/index.less';

export default function Equipment() {
  const history = useHistory();

  useEffect(() => {}, []);
  return (
    <div className={`${Style.content} ${Style.equipment}`}>
      <div
        className={`${Style.button}`}
        onClick={() => {
          history.push(`/${ROUTES.EQUIPMENT}`);
        }}
      ></div>
    </div>
  );
}
