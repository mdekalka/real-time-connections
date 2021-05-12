import cx from 'classnames';

import './ButtonsBox.scss';


export const ButtonsBox = ({ onStart, onStop, polling, fetching, hasPolling, children }) => {
  return (
    <div className="buttons-box">
      {onStart && <button className="button" disabled={polling} onClick={onStart}>start</button>}
      {onStop && <button className="button" disabled={!polling} onClick={onStop}>stop</button>}
      {hasPolling && (
        <div className="status polling-status">Active polling status: <span className={cx('indicator', { disabled: !polling })}></span>
        </div>
      )}
      <div className="status request-status">Request(connection) fetching: <span className={cx('spinner', { hide: !fetching })}></span></div>
      {children}
    </div>
  )
}
