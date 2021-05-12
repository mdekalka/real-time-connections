const { getRandomFact } = require('./utils');

const INTERVAL_UPDATE_DELAY = 5000; // 5 sec
let clients = [];
let facts = [];
let intervalId = null;


async function eventsHandler(request, response, next) {
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
    resetInterval();
    
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });

  resetInterval();

  const fact = await getRandomFact();
  
  publishFacts(fact);

  intervalId = setInterval(async () => {
    const fact = await getRandomFact();

    publishFacts(fact);
  }, INTERVAL_UPDATE_DELAY);
}

function sendEventsToAll(newFact) {
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
}

function resetInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function publishFacts(fact) {
  facts.push(fact);
  sendEventsToAll([fact]);
}

module.exports = {
  eventsHandler
}
