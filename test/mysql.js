const assert = require('assert');
const Database = require('../src');

describe('MySQL Dialect', () => {

  const db = new Database({
    dialect: 'mysql',
    username: 'root',
    password: 'root',
  });

  db.connection.query('CREATE TABLE IF NOT EXISTS users (id int primary key auto_increment, fullname varchar(255), email varchar(255), password varchar(255))');

  it('should return `mysql`', () => {
    assert.equal(
      db.getDialect(),
      'mysql'
    );
  });

  describe('Select Query', () => {
    it('should result.query is `SELECT * FROM users`', async () => {
      const result = await db.table('users').all();
      assert.equal(
        result.query,
        'SELECT * FROM users'
      );
    });

    it('should result.query is `SELECT email, password, fullname FROM users`', async () => {
      const result = await db.table('users').get('email', 'password', 'fullname');
      assert.equal(
        result.query,
        'SELECT email, password, fullname FROM users'
      );
    });

    it('should result.query is `SELECT * FROM users WHERE id=1`', async () => {
      const result = await db.table('users').where('id', 1).get();
      assert.equal(
        result.query,
        'SELECT * FROM users WHERE id=1'
      );
    });

    it('should result.query is `SELECT * FROM users WHERE id=1`', async () => {
      const result = await db.table('users').where({ id: 1 }).get();
      assert.equal(
        result.query,
        'SELECT * FROM users WHERE id=1'
      );
    });
  });

});
