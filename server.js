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
  store.newLobby({ lobbyID }).then(() => res.sendStatus(200));
});

app.post('/recommend', (req, res) => {
  const songID = req.body.songID;
  const lobbyID = req.body.playlistID;

  store.getRecommendations({ lobbyID }).then((result) => {
    const recommendations = result[0].recommendations;
    if (!recommendations.includes(songID)) {
      recommendations.push(songID);
      store.setRecommendations({ lobbyID, recommendations }).then(() => res.sendStatus(200));
    }
  });
});

app.post('/receive', (req, res) => {
  const lobbyID = req.body.playlistID;
  store.getRecommendations({ lobbyID }).then((result) => {
    res.send({ list: result[0].recommendations });
  });
});

app.post('/delete', (req, res) => {
  const songID = req.body.songID;
  const lobbyID = req.body.playlistID;

  store.getRecommendations({ lobbyID }).then((result) => {
    let recommendations = result[0].recommendations;
    const index = recommendations.indexOf(songID);
    if (index > -1) {
      if (recommendations.length === 1) {
        recommendations = [];
        store.setRecommendations({ lobbyID, recommendations }).then(() => res.sendStatus(200));
      } else {
        recommendations.splice(index, 1);
        store.setRecommendations({ lobbyID, recommendations }).then(() => res.sendStatus(200));
      }
    }
  });
});

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
