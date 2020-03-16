const wrapper = (dialect) => {
  const mysql = require(dialect);

  let connect = () => {};
  let exec = () => {};

  if (dialect === 'mariadb') {
    const mariadb = require('./mariadb');
    connect = mariadb.connect;
    exec = mariadb.exec;
  } else {
    connect = (options) => mysql.createPool({
      host: options.host || 'localhost',
      user: options.username || 'root',
      database: options.database || 'test',
      password: options.password || '',
      waitForConnections: options.waitForConnections || true,
      connectionLimit: options.connectionLimit || 100,
      queueLimit: options.queueLimit || 0,
    });

    exec = (connection, query) => new Promise((resolve, reject) => {
      connection.query(query, (err, res) => {
        if (!!err) return reject(err);
        if (!!res.map) return resolve(res.map(r => ({...r})));

        const tmp = {};
        Object.keys(res).forEach(k => { tmp[k] = res[k] });
        resolve(tmp);
      });
    });
  }

  const select = (cols, table, where) => {
    let wheres = '';

    if (!!where) {
      const conditions = Object
        .keys(where)
        .map(k => {
          if (typeof where[k] === 'string') {
            return `\`${k}\` = '${where[k]}'`;
          }
          return `\`${k}\` = ${where[k]}`;
        })
        .join(' AND ');
      return `SELECT ${cols} FROM ${table} WHERE ${conditions}`;
    }

    return `SELECT ${cols} FROM ${table} ${wheres}`.trim();
  };

  const insert = (table, value) => {
    let query = '';
    if (value.length > 0) {
      query = `INSERT INTO ${table}`;
      value = value.map(v => {
        if (v === null) {
          return "NULL";
        }
        return `"${v}"`;
      });
      query += ` VALUES (${value.join(', ')})`;
    } else if(Object.keys(value).length > 0) {
      query += mysql.format(`INSERT INTO ${table} SET ?`, value);
    }
    return query;
  };

  const update = (table, value, where) => {
    let query = mysql.format(`UPDATE ${table} SET ?`, value);

    if (Object.keys(where).length > 0) {
      const conditions = Object
        .keys(where)
        .map(k => {
          if (typeof where[k] === 'string') {
            return `\`${k}\` = '${where[k]}'`;
          }
          return `\`${k}\` = ${where[k]}`;
        })
        .join(' AND ');
      query = `${query} WHERE ${conditions}`;
    }

    return query;
  };

  const del = (table, where) => {
    let query = `DELETE FROM ${table}`;

    if (Object.keys(where).length > 0) {
      const conditions = Object
        .keys(where)
        .map(k => {
          if (typeof where[k] === 'string') {
            return `\`${k}\` = '${where[k]}'`;
          }
          return `\`${k}\` = ${where[k]}`;
        })
        .join(' AND ');
      query = `${query} WHERE ${conditions}`;
    }

    return query;
  };

  return {
    connect,
    exec,
    select,
    insert,
    update,
    del,
  };
};

module.exports = wrapper;
