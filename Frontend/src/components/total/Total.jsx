import { useState, useEffect } from 'react'
import './Total.css'
import axios from 'axios';

const Total = ({ dark, total_num, total_denom }) => {
  const percent = Math.round((total_num / total_denom) * 100);

  return (
    <div className={dark ? 'total-container dark-mode-total' : 'total-container'}>
      <h1 className='total-title'>Total Credits Earned</h1>
      <h1 className='total-value'> {total_num} / {total_denom} </h1>
      <div className="progress-container">
        <progress max={total_denom} value={total_num}></progress>
        <p>{percent}% completed</p>
      </div>
    </div>
  )
}

export default Total;
