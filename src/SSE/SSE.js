import { useState, useEffect, useRef } from 'react';

import './SSE.css';


const API_URL = 'http://localhost:3002';

function getRandomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}


export const SSE = () => {
  const eventSource = useRef(null);
  const factsRef = useRef();
  const [ color, setColor ] = useState('#000');
  const [ error, setError ] = useState(null);
  const [ facts, setFacts ] = useState([]);

  useEffect(() => {
    eventSource.current = new EventSource(`${API_URL}/events`);

    eventSource.current.addEventListener('message', handleMessageEvent);
    eventSource.current.addEventListener('error', handleErrorEvent);

    function handleMessageEvent(event) {
      try {
        const parsedData = JSON.parse(event.data);

        setFacts(facts => [...facts, ...parsedData]);
        setColor(getRandomColor());
        scrollToFact();
      } catch (e) {
        console.error('error with parsing event data', e.message);
      }
    }

    function handleErrorEvent() {
      setError('Something bad happens with server, sorry :(. Please reload the page.');
    }

    return function() {
      if (eventSource.current) {
        eventSource.current.removeEventListener('message', handleMessageEvent);
        eventSource.current.removeEventListener('error', handleErrorEvent);
      }
    }
  }, []);

  function setStyles(index) {
    if (facts.length === index + 1) {
      return { color };
    }
  }

  function scrollToFact() {
    if (factsRef && factsRef.current) {
      const lastFact = factsRef.current.querySelector('.facts-item:last-child');

      lastFact && lastFact.scrollIntoView();
    }
  }

  return (
    <div className="sse-example">
      <h3 className="header">SSE example with Node.js</h3>
      <p className="text">Every 5 seconds server will generate random fact and send it via SSE to client-side</p>
      <p className="text">Open the <span className="highlight">dev tools</span> and find in the network tab <span className="highlight">/events</span> request. Client receives <span className="highlight">JSON</span> data, which could be parsed and rendered on the client-side.</p>

      {error && <div className="error">{error}</div>}
      {!error && (
        <ul className="facts" ref={factsRef}>
          {facts.map((fact, i) => <li className="facts-item" key={i} style={setStyles(i)}>{fact}</li>)}
        </ul>
      )}
    </div>
  )
}
