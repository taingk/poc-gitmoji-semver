const express = require('express');
const app = express();
const port = 3001;

const toto = require('toto');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('test!');
});

app.get('/test2', (req, res) => {
  res.send('test2!');
});

app.get('/test3', (req, res) => {
  res.send('test3!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
