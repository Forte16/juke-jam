const knex = require('knex')(require('./knexfile'));

module.exports = {
  newLobby({
    lobbyID,
    max,
    name,
  }) {
    return knex.select()
      .from('lobbies')
      .whereNotExists('lobby_id', lobbyID)
      .insert({
        lobby_id: lobbyID,
        max_recommendations: max,
        name: name,
      });
  },

  lobbyExists({
    lobbyID,
  }) {
    return knex.select()
      .from('lobbies')
      .where('lobby_id', lobbyID)
      .then(res => res);
  },

  getAllLobbies() {
    return knex.select('lobby_id')
      .from('lobbies')
      .then(res => res);
  },

  updateLobby({
    lobbyID,
    name,
    max,
  }) {
    return knex('lobbies')
      .where('lobby_id', lobbyID)
      .update({
        'name': name,
        'max_recommendations': max,
      });
  },

  addRecommendation({
    lobbyID,
    songID,
    ipAddress,
  }) {
    return knex.select()
      .from('recommendations')
      .insert({
        lobby_id: lobbyID,
        song_id: songID,
        ip_address: ipAddress,
      });
  },

  recommendationExists({
    lobbyID,
    songID,
  }) {
    return knex.select()
      .from('recommendations')
      .where({
        'lobby_id': lobbyID,
        'song_id': songID,
      })
      .then(res => res);
  },

  numberRecommended({
    lobbyID,
    ipAddress,
  }) {
    return knex.count()
      .from('recommendations')
      .where({
        'lobby_id': lobbyID,
        'ip_address': ipAddress,
      })
      .then(res => res);
  },

  getRecommendations({
    lobbyID,
  }) {
    return knex.select('song_id')
      .from('recommendations')
      .where({
        'lobby_id': lobbyID,
        'status': 'new',
      })
      .then(res => res);
  },

  markRecommendation({
    lobbyID,
    songID,
    status,
  }) {
    return knex.select()
      .from('recommendations')
      .where({
        'lobby_id': lobbyID,
        'song_id': songID,
      })
      .update('status', status);
  },

};
