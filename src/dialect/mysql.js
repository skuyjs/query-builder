const wrapper = (dialect) => {
  const mysql = require(dialect);

  const connect = (options) => mysql.createPool({
    host: options.host || 'localhost',
    user: options.username || 'root',
    database: options.database || 'test',
    password: options.password || '',
    waitForConnections: options.waitForConnections || true,
    connectionLimit: options.connectionLimit || 100,
    queueLimit: options.queueLimit || 0,
  });

  const select = (cols, table, where) => {
    let wheres = '';

    if (!!where) {
      wheres = `WHERE ${where}`;
    }

    return `SELECT ${cols} FROM ${table} ${wheres}`.trim();
  };

  const exec = (connection, query) => new Promise((resolve, reject) => {
    connection.query(query, (err, res) => {
      if (!!err) return reject(err);
      resolve(res.map(r => ({...r})));
    });
  });

  return {
    connect,
    exec,
    select,
  }
};

module.exports = wrapper;
