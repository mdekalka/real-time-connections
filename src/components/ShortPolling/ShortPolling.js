import { useState, useEffect, useRef } from 'react';
import cx from 'classnames';

import { API_URL, getSecondsDifference, prettyDate } from '../../utils/utils';

const POLLING_DELAY = 5000; // 5 sec

export const ShortPolling = () => {
  const [ polling, setPolling ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ pingList, setPingList ] = useState([]);
  const timeoutId = useRef(null);

  useEffect(() => {
    const clearTimeout = () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    }

    if (!polling) {
      clearTimeout();
      setPingList([]);
      return;
    }

    const now = new Date();

    const request = async () => {
      try {
        const response = await fetch(`${API_URL}/short-polling`);
        const data = await response.json();
        const responseDate = new Date();

        const ping = {
          value: data.ping,
          date: prettyDate(responseDate),
          timeDifference: getSecondsDifference(now, responseDate)
        };

        setPingList(pings => [...pings, ping]);

        timeoutId.current = window.setTimeout(() => {
          request();
        }, POLLING_DELAY);
      } catch(e) {
        setError(e.message);
        console.log('short polling fetch failed:', e.message);
      }
    }

    request();

    return () => {
      clearTimeout();
    };
  }, [polling]);

  return (
    <div className="short-polling-example">
      <p>
        <span className="highlight">Short polling</span> is periodic polling to the server to check if there are any new information available. That's it, <span className="highlight">regular</span> requests to the server often with <span className="highlight">5-10 sec delays</span>.
      </p>
      <p>
        Open the dev tools and find <span className="highlight">/short-polling</span> request in the network tab, it will be sequential HTTP requests with <span className="highlight">5 seconds delay</span> to the server.
        <br />
        Server will randomly generates <span className="highlight">boolean</span> value and returns it back to the client.
      </p>
      <div className="buttons-box">
        <button className="button" onClick={() => setPolling(true)}>start</button>
        <button className="button" onClick={() => setPolling(false)}>stop</button>
        <div className="status">Active polling status <span className={cx('indicator', { disabled: !polling })}></span></div>
      </div>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Request date / interval from initial call</th>
            <th>Response ping value</th>
          </tr>
        </thead>

        <tbody>
          {pingList.map(({ date, timeDifference, value }) => {
            return (
              <tr key={timeDifference}>
                <td>{date} / in ~{timeDifference} seconds</td>
                <td>{value.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
