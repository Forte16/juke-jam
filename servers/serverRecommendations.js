const express = require('express');
const http = require('http');

// our localhost port
const port = 5555;

const app = express();

app.use(express.json());

// our server instance
const server = http.createServer(app);

/*
  CODE FOR STORING RECOMMENDATIONS
*/

var recMap = new Map(); //key: codes; values: strings of song ids

/*
  ------------------------------------------------------------------------
*/

app.post('/recommend', (req, res) => {
  songID = req.body.songID;
  playlistID = req.body.playlistID;
  if (typeof recMap.get(playlistID) === 'undefined') {
    recMap.set(playlistID, [songID]); // set the code to map to an array holding just the code
  } else {
    let array = recMap.get(playlistID);
    if (!array.includes(songID)) {
      array.push(songID);
      recMap.set(playlistID, array);
    }
  }
  console.log(recMap.get(playlistID))
});


app.post('/receive', (req, res) => {
  playlistID = req.body.playlistID;
  res.send({list: recMap.get(playlistID)});
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

server.listen(port, () => console.log(`Listening on port ${port}`))
