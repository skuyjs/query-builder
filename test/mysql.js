const test = require('ava');
const Database = require('../src');

const dialect = 'mysql';

const db = new Database({
  dialect,
  username: 'root',
  password: 'root',
});

db.connection.query('CREATE TABLE IF NOT EXISTS users (id int primary key auto_increment, fullname varchar(255), email varchar(255), password varchar(255))');

test(`return \`${dialect}\``, t => {
  t.is(
    db.getDialect(),
    dialect
  );
});

test('result.query is `SELECT * FROM users`', async (t) => {
  const result = await db.table('users').all();
  t.is(
    result.query,
    'SELECT * FROM users'
  );
});

test('result.query is `SELECT email, password, fullname FROM users`', async (t) => {
  const result = await db.table('users').get('email', 'password', 'fullname');
  t.is(
    result.query,
    'SELECT email, password, fullname FROM users'
  );
});

test('result.query is `SELECT * FROM users WHERE id=1`', async (t) => {
  const result = await db.table('users').where({id: 1}).get();

  t.is(
    result.query,
    'SELECT * FROM users WHERE id=1'
  );
});

test('result.query is `INSERT INTO users VALUES (NULL, "email", "password", "fullname")`', async (t) => {
  const result = await db.table('users').insert([null, 'email', 'password', 'fullname']);

  t.is(
    result.query,
    'INSERT INTO users VALUES (NULL, "email", "password", "fullname")'
  );
});

test("result.query is `INSERT INTO users SET `email` = 'email', `password` = 'password', `fullname` = 'fullname'`", async (t) => {
  const result = await db.table('users').insert({
    email: 'email',
    password: 'password',
    fullname: 'fullname',
  });

  t.is(
    result.query,
    "INSERT INTO users SET `email` = 'email', `password` = 'password', `fullname` = 'fullname'"
  );
});

test('result.query is `UPDATE users SET fullname="fullname", email="email", password="password"`', async (t) => {
  const result = await db.table('users').where().update({
    fullname: 'fullname',
    email: 'email',
    password: 'password',
  });

  t.is(
    result.query,
    'UPDATE users SET fullname="fullname", email="email", password="password"'
  );
});

test('result.query is `UPDATE users SET fullname="fullname", email="email", password="password" WHERE id=1`', async (t) => {
  const result = await db.table('users').where({ id: 1 }).update({
    fullname: 'fullname',
    email: 'email',
    password: 'password',
  });

  t.is(
    result.query,
    'UPDATE users SET fullname="fullname", email="email", password="password" WHERE id=1'
  );
});

test('result.query is `DELETE FROM users`', async (t) => {
  const result = await db.table('users').where().rm();

  t.is(
    result.query,
    'DELETE FROM users'
  );
});

test('result.query is `DELETE FROM users WHERE id=1`', async (t) => {
  const result = await db.table('users').where({ id: 1 }).rm();

  t.is(
    result.query,
    'DELETE FROM users WHERE id=1'
  );
});
