const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { eventsHandler } = require('./sse');

const PORT = 3002;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})

app.get('/short-polling', function(request, response) {
  response.json({ ping: Math.random() < 0.5 });
});

const LONG_POLLING_DELAY = 10000; //10 sec
app.get('/long-polling', function(request, response) {
  setTimeout(() => {
    response.json({ shortcode: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6) });
  }, LONG_POLLING_DELAY)
});

app.get('/events', eventsHandler);
