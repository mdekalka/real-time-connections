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

// SSE events handler
// app.get('/events', eventsHandler);
