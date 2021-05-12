import { useState, useEffect, useRef } from 'react';

import { API_URL, getRandomColor } from '../../utils/utils';

import { ButtonsBox } from '../ButtonsBox/ButtonsBox';

import './ServerSentEvents.css';


export const ServerSentEvents = () => {
  const eventSource = useRef(null);

  const [ connected, setConnected ] = useState(true);
  const [ color, setColor ] = useState('#000');
  const [ error, setError ] = useState(null);
  const [ facts, setFacts ] = useState([]);

  useEffect(() => {
    const initEventSource = () => {
      eventSource.current = new EventSource(`${API_URL}/events`);
      setConnected(true);
  
      eventSource.current.addEventListener('message', handleMessageEvent);
      eventSource.current.addEventListener('error', handleErrorEvent);
    }

    if (!connected) return;

    function handleMessageEvent(event) {
      try {
        const parsedData = JSON.parse(event.data);

        setFacts(facts => [...facts, ...parsedData]);
        setColor(getRandomColor());
      } catch (e) {
        setConnected(false);
        setError(e.message);
        console.error('error with parsing event data', e.message);
      }
    }

    function handleErrorEvent() {
      setConnected(false);
      setError('Something bad happens with server, sorry :(. Please reload the page.');
    }

    initEventSource();

    return function() {
      if (eventSource.current) {
        setConnected(false);
        eventSource.current.removeEventListener('message', handleMessageEvent);
        eventSource.current.removeEventListener('error', handleErrorEvent);
        eventSource.current.close();
        eventSource.current = null;
      }
    }
  }, []);

  function setStyles(index) {
    if (facts.length === index + 1) {
      return { color };
    }
  }

  return (
    <div className="sse-example">
      <p>
        <span className="highlight">The Server-Sent Events</span> specification describes a built-in class <span className="highlight">EventSource</span>, that keeps connection with the server and allows to receive events from it.
      </p>
      <p>It's one-directional, only server sends data via opened regular HTTP connection.</p>

      <p>
        Open dev tools and find <span className="highlight">/events</span> request in the network tab. <br />
        Every <span className="highlight">5</span> seconds server will generate random fact and send it as stringified JSON to client <span className="highlight">w/o closing</span> the HTTP connection.
      </p>
      <ButtonsBox fetching={connected} />
      {error && <div className="error">{error}</div>}

      {!error && (
        <ul className="facts">
          {facts.map((fact, i) => <li className="facts-item" key={i} style={setStyles(i)}>{fact}</li>)}
        </ul>
      )}
    </div>
  )
}
