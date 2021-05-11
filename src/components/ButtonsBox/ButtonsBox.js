import cx from 'classnames';

import './ButtonsBox.scss';


export const ButtonsBox = ({ onStart, onStop, disabled, fetching }) => {
  return (
    <div className="buttons-box">
      <button className="button" onClick={onStart}>start</button>
      <button className="button" onClick={onStop}>stop</button>
      <div className="status polling-status">Active polling status: <span className={cx('indicator', { disabled })}></span></div>
      <div className="status request-status">Request fetching: <span className={cx('spinner', { hide: !fetching })}></span></div>
    </div>
  )
}
