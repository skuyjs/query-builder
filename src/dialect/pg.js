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

const update = (table, value, conditions) => {
  let query = `UPDATE ${table} SET `;
  query += Object.keys(value).map(v => {
    let tmp = `${v}=`;
    if (typeof value[v] === 'string') {
      tmp += `"${value[v]}"`;
    } else {
      tmp += `${value[v]}`;
    }
    return tmp;
  })
  .join(', ');

  if (conditions !== null && conditions.length > 0) {
    query += ' WHERE ';
    query += conditions.join(' AND ');
  }

  return query;
};

module.exports = {
  connect,
  exec,
  select,
  insert,
  update,
};
