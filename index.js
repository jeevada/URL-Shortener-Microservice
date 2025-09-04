require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

const urlDatabase = {};
let idCounter = 1;

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let original_url = req.body.url;

  if (!/^https?:\/\//i.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    const urlObj = new URL(original_url);
    const short_url = idCounter++;
    urlDatabase[short_url] = original_url;

    res.json({original_url, short_url});
  }catch (err) {
    res.json({error: 'invalid url'});
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const original_url = urlDatabase[id];

  if (original_url) {
    res.redirect(original_url);
  } else {
    res.json({ error: 'No short URL found for given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
