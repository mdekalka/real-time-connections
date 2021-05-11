import { useState, useEffect, useRef } from 'react';

import { API_URL } from '../../utils/utils';

import { ButtonsBox } from '../ButtonsBox/ButtonsBox';


export const LongPolling = () => {
  const unmounted = useRef(null);
  const [ polling, setPolling ] = useState(true);
  const [ fetching, setFetching ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ shortcodes, setShortcodes ] = useState([]);

  useEffect(() => {
    if (!polling) {
      unmounted.current = true;
      return;
    };

    unmounted.current = false;

    const request = async (polling) => {
      if (unmounted.current) return;

      setFetching(true);

      try {
        const response = await fetch(`${API_URL}/long-polling`);
        const data = await response.json();

        setFetching(false);
        if (unmounted.current) return;

        setShortcodes(shortcodes => [...shortcodes, data.shortcode]);

        request(polling);
      } catch(e) {
        setError(e.message);
        setFetching(false);
        console.log('short polling fetch failed:', e.message);
      }
    }

    request(polling);

    return function() {
      unmounted.current = true;
    }
  }, [polling]);

  return (
    <div className="long-polling-example">
      <p>
        <span className="highlight">Long polling</span> is the simplest way of having "persistent" connection with server, that doesn’t use any specific protocol like WebSocket or Server Side Events.

        Being very easy to implement, it’s also good enough in a lot of cases.
      </p>
      <p>
        Open dev tools and find <span className="highlight">/long-polling</span> request(s) in the network tab, next HTTP call will be requeted immediately after previous one responded.
      </p>
      <p>
        Server will wait for <span className="highlight">10 seconds</span> and randomly generate a shortcode, at tha time HTTP request will be in <span className="highlight">pending</span> state and will be closed only after receving the data.
      </p>

      <ButtonsBox
        onStart={() => setPolling(true)}
        onStop={() => setPolling(false)}
        fetching={fetching}
        disabled={!polling}
      />
      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Request index </th>
            <th>Response shortcode</th>
          </tr>
        </thead>

        <tbody>
          {shortcodes.map((shortcode, index) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>{shortcode}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
  )
}
