const WebSocket = require('ws');

const { getRandomFact } = require('./utils');

const INTERVAL_UPDATE_DELAY = 5000; // 5 sec
const wss = new WebSocket.Server({ port: 8002 });
let intervalId = null;


wss.on('connection', function(instance) {
  instance.on('message', message => {
    let event;
    try {
      event = JSON.parse(message);
      console.log(event, 'message from client');
    } catch(e) {
      console.log('response parsing failed:', e.message)
    }
  });

  intervalId = setInterval(async () => {
    const message = await getRandomFact();
    const event = { from: 'server', message };

    instance.send(JSON.stringify(event));
  }, INTERVAL_UPDATE_DELAY);
})
