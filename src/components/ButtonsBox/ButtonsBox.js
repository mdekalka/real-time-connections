import cx from 'classnames';

import './ButtonsBox.scss';


export const ButtonsBox = ({ onStart, onStop, polling, fetching, hasPolling, children }) => {
  return (
    <div className="buttons-box">
      <button className="button" onClick={onStart}>start</button>
      <button className="button" onClick={onStop}>stop</button>
      {hasPolling && (
        <div className="status polling-status">Active polling status: <span className={cx('indicator', { disabled: !polling })}></span>
        </div>
      )}
      <div className="status request-status">Request(connection) fetching: <span className={cx('spinner', { hide: !fetching })}></span></div>
      {children}
    </div>
  )
}
