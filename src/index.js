class Database {
  constructor(options = {}) {
    this.options = {
      dialect: 'mysql',
      ...options,
    };

    if (['mysql', 'mysql2'].indexOf(this.options.dialect) >= 0) {
      if (this.options.dialect === 'mysql2') {
        this.dialect = require(`./dialect/mysql`)('mysql2');
      } else {
        this.dialect = require(`./dialect/mysql`)('mysql');
      }
    } else {
      this.dialect = require(`./dialect/${this.options.dialect}`);
    }
    this.tableName = '';
    this.connection = this.dialect.connect(this.options);
  }

  getDialect() {
    return this.options.dialect;
  }

  table(name) {
    this.tableName = name;
    return this;
  }

  where(conditions, value) {
    this.conditions = '';
    if (typeof conditions === 'string') {
      this.conditions = `${conditions}=${value}`;
    } else if (typeof conditions === 'object') {
      this.conditions = Object.keys(conditions).map(c => `${c}=${conditions[c]}`);
    }

    return this;
  }

  async all() {
    const result = {};
    result.query = this.dialect.select('*', this.tableName);
    result.rows = await this.dialect.exec(this.connection, result.query);
    return result;
  }

  async get(...cols) {
    let colsParsed = cols.join(', ');

    if (cols.length <= 0) {
      colsParsed = '*';
    }

    const result = {};
    result.query = this.dialect.select(colsParsed, this.tableName, this.conditions);

    try {
      result.rows = await this.dialect.exec(this.connection, result.query);
    } catch (e) {
      result.error = e;
    }

    return result;
  }

  close() {
    this.connection.end();
  }
}

module.exports = Database;
