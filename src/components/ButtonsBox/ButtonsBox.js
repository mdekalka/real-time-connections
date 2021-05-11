import cx from 'classnames';

import './ButtonsBox.scss';


export const ButtonsBox = ({ onStart, onStop, disabled }) => {
  return (
    <div className="buttons-box">
      <button className="button" onClick={onStart}>start</button>
      <button className="button" onClick={onStop}>stop</button>
      <div className="status">Active polling status <span className={cx('indicator', { disabled })}></span></div>
    </div>
  )
}
