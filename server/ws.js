const WebSocket = require('ws');

const { getRandomFact } = require('./utils');

const INTERVAL_UPDATE_DELAY = 5000; // 5 sec
const wss = new WebSocket.Server({ port: 8002 });
let intervalId = null;


wss.on('connection', async function (instance) {
  instance.on('message', message => {
    let event;

    try {
      event = JSON.parse(message);
      console.log(event, 'message from client');
    } catch(e) {
      console.log('response parsing failed:', e.message)
    }
  });

  const message = await getRandomFact();

  sendEvent(instance, message);

  intervalId = setInterval(async () => {
    const message = await getRandomFact();

    sendEvent(instance, message);
  }, INTERVAL_UPDATE_DELAY);
})

function sendEvent(instance, message) {
  const event = { from: 'server', message };

  try {
    instance.send(JSON.stringify(event));
  } catch (e) {
    console.log('sending event failed:', e.message)
  }
}
