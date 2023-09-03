import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ROUTES } from '@/utils/enum';
import Style from '../assets/index.less';

export default function Home() {
  const history = useHistory();
  // useEffect(() => {
  //   // console.log('home', location.hash);
  // }, []);
  const renderButtons = () => {
    return [
      {
        link: ROUTES.PERSONAL_INFO,
        label: '装备',
      },
      {
        link: ROUTES.TASK,
        label: '任务',
      },
      {
        link: ROUTES.REWARD,
        label: '排行榜',
      },
      {
        link: ROUTES.COMING_SOON,
        // link: ROUTES.BACKPACK,
        label: '背包',
      },
      {
        // link: ROUTES.WAREHOUSE,
        link: ROUTES.COMING_SOON,
        label: '物资库',
      },
      {
        link: ROUTES.TRAINING_INSTITUTE,
        label: '训练所',
      },
      {
        link: ROUTES.COMING_SOON,
        // link: ROUTES.TREASURE,
        label: '宝箱',
      },
      {
        link: ROUTES.BASE,
        label: '基地',
      },
    ].map((v, i) => {
      return (
        <button
          className={Style.buttons}
          onClick={() => {
            history.push(`/${v.link}`);
          }}
        >
          <span>{v.label}</span>
        </button>
      );
    });
  };
  return (
    <div className={`${Style.content} ${Style.home}`}>
      <div className={Style.actions}>{renderButtons()}</div>
    </div>
  );
}
