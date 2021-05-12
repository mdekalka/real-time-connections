import { useState, useEffect, useRef } from 'react';

import { useAsyncReference } from '../../hooks/useAsyncReference';

import { ButtonsBox } from '../ButtonsBox/ButtonsBox';


export const WebSockets = () => {
  const wsInstance = useRef(null);
  const [ fetching, setFetching ] = useState(false);

  const [ events, setEvents ] = useState([])
  const [ error, setError ] = useState(null);

  useEffect(() => {
    wsInstance.current = new WebSocket('ws://localhost:8000');

    wsInstance.current.addEventListener('open', () => {
      setFetching(true);
    });

    wsInstance.current.addEventListener('message', response => {
      try {
        const event = JSON.parse(response.data);
        
        setEvents(events => [...events, event]);
      } catch(e) {
        console.log('ws message parsed error:', e.message);
      }
    });

    wsInstance.current.addEventListener('error', (e) => {
      setError(e.message);
      console.log('ws connection error:', e.message);
    });

    wsInstance.current.addEventListener('close', () => {
      setFetching(false);
      console.log('ws connection closed');
    });
  }, []);

  const sendClientMessage = () => {
    if (wsInstance.current) {
      const event = { from: 'client', message: 'Ping from the client' };

      setEvents(events => [...events, event]);
      wsInstance.current.send(JSON.stringify(event));
    }
  }

  return (
    <div className="sse-example">
      <p>
        <span className="highlight">The WebSocket</span> protocol provides a way to exchange data between browser and server via a <span className="highlight">persistent</span> connection.
      </p>
      <p>WebSocket is great for services that require continuous data exchange, e.g. online games, real-time trading systems and etc.</p>

      <p>
        Open dev tools and find <span className="highlight">/ws</span> connection in the network(WS) tab. <br />
        Every <span className="highlight">5</span> seconds server will generate random fact and send it as stringified JSON to client.
      </p>
      <ButtonsBox fetching={fetching} >
        <button className="button" onClick={sendClientMessage}>Send client message</button>
      </ButtonsBox>
      {error && <div className="error">{error}</div>}

      {!error && (
        <table>
          <thead>
            <tr>
              <th>Request origin</th>
              <th>Request(response) message</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => {
              return (
                <tr key={index}>
                  <td>{event.from}</td>
                  <td>{event.message}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

    </div>
  )
}
