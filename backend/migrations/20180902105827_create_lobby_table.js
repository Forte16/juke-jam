exports.up = function (knex) {
  return createLobbiesTable();

  function createLobbiesTable() {
    return knex.schema.createTable('lobbies', function (t) {
      t.string('lobby_id').primary();
      t.json('recommendations');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTable('lobbies');
};
