const mariadb = require('mariadb');

const connect = (options) => mariadb.createPool({
  host: options.host || 'localhost',
  user: options.username || 'root',
  database: options.database || 'test',
  password: options.password || '',
  waitForConnections: options.waitForConnections || true,
  connectionLimit: options.connectionLimit || 100,
  queueLimit: options.queueLimit || 0,
});

const exec = (connection, query) => new Promise((resolve, reject) => {
  connection
    .getConnection()
    .then(con => {
      con
        .query(query)
        .then(d => d.filter(a => d.meta))
        .then(resolve)
        .catch(reject)
        .finally(con.release);
    });
});

module.exports = {
  connect,
  exec,
};
