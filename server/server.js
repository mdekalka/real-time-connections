const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3002;
const INTERVAL_UPDATE_DELAY = 5000; // 5sec
let intervalId = null;

let clients = [];
let facts = [];

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})

function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);
  const data = `data: ${JSON.stringify(facts)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response
  };

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  intervalId = setInterval(async () => {
    const fact = await getRandomFact();

    console.log('new fact', fact);

    facts.push(fact);
    sendEventsToAll([fact]);

  }, INTERVAL_UPDATE_DELAY);
}

app.get('/events', eventsHandler);

async function getRandomFact() {
  try {
    const response = await fetch('https://useless-facts.sameerkumar.website/api');
    const reponseData = await response.json();

    return reponseData ? reponseData.data : null;
  } catch(e) {
    console.log('random fact API has failed with', e.message);
  }
}

function sendEventsToAll(newFact) {
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
}
