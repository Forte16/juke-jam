const express = require('express');
const http = require('http');
const path = require('path');
const store = require('./backend/store');

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

app.post('/create', (req, res) => {
  const lobbyID = req.body.playlistID;
  const max = req.body.max;
  const name = req.body.name;
  store.lobbyExists({ lobbyID }).then((result) => {
    if (result.length === 0) {
      store.newLobby({ lobbyID, max, name }).then(() => res.sendStatus(200));
    } else {
      res.sendStatus(200);
    }
  });
});

app.post('/recommend', (req, res) => {
  const lobbyID = req.body.playlistID;
  const songID = req.body.songID;
  const ipAddress = req.ip;
  Promise.all([
    store.recommendationExists({ lobbyID, songID }),
    store.numberRecommended({ lobbyID, ipAddress }),
    store.lobbyExists({ lobbyID }),
  ]).then(function (values) {
    const recExists = (values[0].length !== 0);
    const numRecs = values[1][0].count;
    const maxRecs = values[2][0].max_recommendations;
    if (numRecs >= maxRecs) {
      res.sendStatus(429);
    } else if (recExists) {
      res.sendStatus(409);
    } else {
      store.addRecommendation({ lobbyID, songID, ipAddress }).then(() => res.sendStatus(200));
    }
  });
});

app.post('/receive', (req, res) => {
  const lobbyID = req.body.playlistID;
  store.getRecommendations({ lobbyID }).then((result) => {
    const songs = [];
    for (let i = 0; i < result.length; i += 1) {
      songs.push(result[i].song_id);
    }
    res.send({ list: songs });
  });
});

app.post('/delete', (req, res) => {
  const lobbyID = req.body.playlistID;
  const songID = req.body.songID;
  const status = 'deleted';
  store.markRecommendation({ lobbyID, songID, status }).then(() => res.sendStatus(200));
});

app.post('/add', (req, res) => {
  const lobbyID = req.body.playlistID;
  const songID = req.body.songID;
  const status = 'added';
  store.markRecommendation({ lobbyID, songID, status }).then(() => res.sendStatus(200));
});

app.post('/update', (req, res) => {
  const lobbyID = req.body.playlistID;
  const name = req.body.name;
  const max = req.body.max;
  store.updateLobby({ lobbyID, name, max }).then(() => res.sendStatus(200));
});

app.get('/exists', (req, res) => {
  const lobbyID = req.query.lobbyID;
  store.lobbyExists({ lobbyID }).then((result) => {
    if (result.length === 0) {
      res.sendStatus(404);
    } else {
      res.send({ lobby: result[0] });
    }
  });
});

app.get('/getAll', (req, res) => {
  store.getAllLobbies().then((result) => {
    const lobbies = result.map(x => x.lobby_id);
    res.send({ lobbies: lobbies });
  });
});

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
