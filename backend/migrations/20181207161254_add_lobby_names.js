exports.up = function (knex) {
  return addToLobbiesTable();

  function addToLobbiesTable() {
    return knex.schema.table('lobbies', function (t) {
      t.string('name');
    });
  }
};

exports.down = function (knex) {
  return dropAddToLobbiesTable();

  function dropAddToLobbiesTable() {
    return knex.schema.table('lobbies', function (t) {
      t.dropColumn('name');
    });
  }
};
