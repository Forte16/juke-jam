const express = require('express');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 5555;
const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(function (req, res, next) { // allow CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


/*
  CODE FOR STORING RECOMMENDATIONS
*/

var recMap = new Map(); // key: codes; values: strings of song ids

/*
  ------------------------------------------------------------------------
*/

app.post('/recommend', (req, res) => {
  const songID = req.body.songID;
  const playlistID = req.body.playlistID;
  if (typeof recMap.get(playlistID) === 'undefined') {
    recMap.set(playlistID, [songID]); // set the code to map to an array holding just the code
  } else {
    const array = recMap.get(playlistID);
    if (!array.includes(songID)) {
      array.push(songID);
      recMap.set(playlistID, array);
    }
  }
});


app.post('/receive', (req, res) => {
  const playlistID = req.body.playlistID;
  res.send({ list: recMap.get(playlistID) });
});


app.post('/delete', (req, res) => {
  songID = req.body.songID;
  playlistID = req.body.playlistID;

  let array = recMap.get(playlistID);
  let index = array.indexOf(songID);

  if (index > -1) {
    if (array.length === 1) {
      recMap.set(playlistID, []);
    } else {
      array.splice(index, 1)
      recMap.set(playlistID, array);
    }
  }
});

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`))
