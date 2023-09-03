import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '@/utils/enum';
import Style from './index.less';
export default function Nav() {
  const history = useHistory();
  return (
    <div className={`${Style.nav}`}>
      <button
        onClick={() => {
          history.push(`/`);
        }}
      ></button>
      <button></button>
      <button></button>
      <button></button>
    </div>
  );
}
