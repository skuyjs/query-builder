const mysql = require('mysql2');

const connect = (options) => mysql.createPool({
  host: options.host || 'localhost',
  user: options.username || 'root',
  database: options.database || 'test',
  password: options.password || '',
  waitForConnections: options.waitForConnections || true,
  connectionLimit: options.connectionLimit || 10,
  queueLimit: options.queueLimit || 0,
});

const select = (cols, table, where) => {
  let wheres = '';

  if (!!where) {
    wheres = `WHERE ${where}`;
  }

  return `SELECT ${cols} FROM ${table} ${wheres}`.trim();
};

module.exports = {
  connect,
  select,
};
