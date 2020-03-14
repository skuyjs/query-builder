const pg = require('pg');

const connect = (options) => new pg.Pool({
  host: options.host || 'localhost',
  user: options.username || 'root',
  database: options.database || 'test',
  password: options.password || '',
  port: options.port || 5432,
});

const exec = async (connection, query) => {
  try {
    const result = await connection.query(query);
    return result.rows;
  } catch (e) {
    throw e;
  }
};

const select = (cols, table, where) => {
  let wheres = '';

  if (!!where) {
    wheres = `WHERE ${where}`;
  }

  return `SELECT ${cols} FROM ${table} ${wheres}`.trim();
};

const insert = (table, value) => {
  let query = `INSERT INTO ${table} `;
  if (value.length > 0) {
    value = value.map(v => {
      if (v === null || v.toUpperCase() === 'DEFAULT') {
        return `DEFAULT`;
      }
      return `'${v}'`;
    });
    query += `VALUES(${value.join(', ')})`;
  } else if (Object.keys(value).length > 0) {
    query += '(';
    query += Object.keys(value).map(v => {
        return v;
      })
      .join(', ');

    query += ') VALUES (';

    query += Object.keys(value).map(v => {
        return `'${value[v]}'`;
      })
      .join(', ');
      query += ')';
  }
  return query;
};

module.exports = {
  connect,
  exec,
  select,
  insert,
};
