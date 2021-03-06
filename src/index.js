class Database {
  constructor(options = {}) {
    this.options = {
      dialect: 'mysql',
      ...options,
    };

    if (['mysql', 'mysql2', 'mariadb'].indexOf(this.options.dialect) >= 0) {
      this.dialect = require(`./dialect/mysql`)(this.options.dialect);
    } else {
      this.dialect = require(`./dialect/${this.options.dialect}`);
    }
    this.clear();
    this.connection = this.dialect.connect(this.options);
  }

  getDialect() {
    return this.options.dialect;
  }

  table(name) {
    this.clear();
    this.tableName = name;
    return this;
  }

  getTable() {
    return this.tableName;
  }

  where(conditions, value) {
    this.conditions = {};
    if (typeof conditions === 'string') {
      this.conditions[conditions] = value;
    } else if (typeof conditions === 'object') {
      this.conditions = conditions;
    }

    return this;
  }

  clear() {
    this.conditions = {};
    this.tableName = '';
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

  async insert(value) {
    let query = this.dialect.insert(this.getTable(), value);
    let result = await this.dialect.exec(this.connection, query);

    return {
      query,
      result,
    };
  }

  async update(value) {
    let query = this.dialect.update(this.getTable(), value, this.conditions);
    let result = await this.dialect.exec(this.connection, query);

    return {
      query,
      result,
    };
  }

  async del() {
    let query = this.dialect.del(this.getTable(), this.conditions);
    let result = await this.dialect.exec(this.connection, query);

    return {
      query,
      result,
    };
  }

  close() {
    this.dialect.disconnect(this.connection);
  }
}

module.exports = Database;
