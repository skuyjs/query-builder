const pg = require('pg');

const connect = (options) => new pg.Pool({
  host: options.host || 'localhost',
  user: options.username || 'root',
  database: options.database || 'test',
  password: options.password || '',
  port: options.port || 5432,
});

const select = (cols, table, where) => {
  let wheres = '';

  if (!!where) {
    wheres = `WHERE ${where}`;
  }

  return `SELECT ${cols} FROM ${table} ${wheres}`.trim();
};

const exec = async (connection, query) => {
  try {
    const result = await connection.query(query);
    return result.rows;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  connect,
  select,
  exec,
};
