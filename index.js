const express = require('express');
const app = express();
const port = 3001;

const toto = require('toto');

app.get('/', (req, res) => {
  res.send(toto);
});

app.get('/hello', (req, res) => {
  res.send('world!');
});

app.get('/health-check', (req, res) => {
  res.send('we r right');
});

app.get('/test3', (req, res) => {
  res.send('test3!');
});

app.get('/test4', (req, res) => {
  res.send('test4!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
