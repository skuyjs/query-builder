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

const disconnect = (connection) => connection.end();

const exec = (connection, query) => new Promise((resolve, reject) => {
  connection
    .getConnection()
    .then(con => {
      con
        .query(query)
        .then(d => {
          if (!!d.filter) return d.filter(a => d.meta);
          return d;
        })
        .then(resolve)
        .catch(reject)
        .finally(con.release);
    });
});

module.exports = {
  connect,
  disconnect,
  exec,
};
