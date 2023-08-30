import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Style from '../assets/index.less';

export default function Home() {
  const history = useHistory();
  const goToHome = () => {
    history.push('/detail');
  };
  useEffect(() => {
    console.log('home', location.hash);
  }, []);
  return (
    <div className={Style.popup}>
      <div className={Style.content}>
        <div onClick={goToHome}>Hack Demo</div>
        <Link to="/detail">Detail</Link>
      </div>
    </div>
  );
}
