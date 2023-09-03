import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '@/utils/enum';
import Style from '../assets/index.less';

export default function PersonalInfo() {
  const history = useHistory();

  useEffect(() => {
    console.log('detail', location.hash);
  }, []);
  return (
    <div className={`${Style.content} ${Style.personalInfo}`}>
      <div
        className={`${Style.button}`}
        onClick={() => {
          history.push(`/${ROUTES.EQUIPMENT}`);
        }}
      ></div>
    </div>
  );
}
