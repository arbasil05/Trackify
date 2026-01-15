import { useState, useEffect } from 'react'
import './Total.css'
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const Total = ({ total_num, total_denom, Loading }) => {
  const { isDark: dark } = useTheme();
  const percent = Math.round((total_num / total_denom) * 100);

  return (
    !Loading ? (
      <div className={dark ? 'total-container dark-mode-total' : 'total-container'}>
        <h1 className='total-title'>Total Credits Earned</h1>
        <h1 className='total-value'> {total_num} / {total_denom} </h1>
        <div className="progress-container">
          <progress max={total_denom} value={total_num}></progress>
          <p>{percent}% completed</p>
        </div>
      </div>
    ) : (
      <div className={dark ? 'total-container dark-mode-total' : 'total-container'}>
        <div className={dark?'skeleton-dark':'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='total-title'>Total Credits Earned</h1>
        </div>
        <div className={dark?'skeleton-dark':'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='total-value'> {total_num} / {total_denom} </h1>
        </div>
        <div className={dark?'skeleton-dark':'skeleton-light'}>
          <progress style={{ visibility: "hidden" }} max={total_denom} value={total_num}></progress>
          <p style={{ visibility: "hidden" }}>{percent}% completed</p>
        </div>
      </div>
    )
  );

}

export default Total;
