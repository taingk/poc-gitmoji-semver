const express = require('express');
const app = express();
const port = 3001;

const toto = require('toto');

app.get('/', (req, res) => {
  res.send(toto + ' 3');
});

app.get('/hello', (req, res) => {
  res.send('world! yes! its over!');
});

app.get('/health-check', (req, res) => {
  res.send('we r right');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
