module.exports = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL || {
    user: 'alexandroforte',
    password: 'password',
    database: 'juke_jam',
  },
};
