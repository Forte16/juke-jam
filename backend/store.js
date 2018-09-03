const knex = require('knex')(require('./knexfile'));

module.exports = {
  newLobby({
    lobbyID,
  }) {
    return knex.select()
      .from('lobbies')
      .whereNotExists('lobby_id', lobbyID)
      .insert({
        lobby_id: lobbyID,
        recommendations: JSON.stringify([]),
      });
  },

  getRecommendations({
    lobbyID,
  }) {
    return knex.select()
      .from('lobbies')
      .where('lobby_id', lobbyID)
      .then(res => res);
  },

  setRecommendations({
    lobbyID,
    recommendations,
  }) {
    return knex.select()
      .from('lobbies')
      .where('lobby_id', lobbyID)
      .update('recommendations', JSON.stringify(recommendations))
      .then(res => res);
  },
};
