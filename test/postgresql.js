const test = require('ava');
const Database = require('../src');

const db = new Database({
  dialect: 'pg',
  username: 'hammurabi',
  password: 'hammurabi',
});

db.connection.query('CREATE TABLE IF NOT EXISTS users (id serial not null primary key, fullname varchar(255), email varchar(255), password varchar(255))');

test('should return `pg`', (t) => {
  t.is(
    db.getDialect(),
    'pg'
  );
});

test('should result.query is `SELECT * FROM users`', async (t) => {
    const result = await db.table('users').all();
    t.is(
      result.query,
      'SELECT * FROM users'
    );
  });

test('should result.query is `SELECT email, password, fullname FROM users`', async (t) => {
  const result = await db.table('users').get('email', 'password', 'fullname');
  t.is(
    result.query,
    'SELECT email, password, fullname FROM users'
  );
});

test('should result.query is `SELECT * FROM users WHERE id=1`', async (t) => {
  const result = await db.table('users').where({ id: 1 }).get();
  t.is(
    result.query,
    'SELECT * FROM users WHERE id=1'
  );
});

test('should result.query is `INSERT INTO users VALUES(NULL, "email", "password", "fullname")`', async (t) => {
  const result = await db.table('users').insert(['DEFAULT', 'email', 'password', 'fullname']);

  t.is(
    result.query,
    "INSERT INTO users VALUES(DEFAULT, 'email', 'password', 'fullname')"
  );
});

test("result.query is `INSERT INTO users(email, password, fullname) VALUES('email', 'password', 'fullname')`", async (t) => {
  const result = await db.table('users').insert({
    email: 'email',
    password: 'password',
    fullname: 'fullname',
  });

  t.is(
    result.query,
    "INSERT INTO users (email, password, fullname) VALUES ('email', 'password', 'fullname')"
  );
});

test("result.query is `UPDATE users SET fullname='fullname', email='email', password='password'`", async (t) => {
  const result = await db.table('users').where().update({
    fullname: 'fullname',
    email: 'email',
    password: 'password',
  });

  t.is(
    result.query,
    "UPDATE users SET fullname='fullname', email='email', password='password'"
  );
});

test("result.query is `UPDATE users SET fullname='fullname', email='email', password='password' WHERE id=1`", async (t) => {
  const result = await db.table('users').where({ id: 1 }).update({
    fullname: 'fullname',
    email: 'email',
    password: 'password',
  });

  t.is(
    result.query,
    "UPDATE users SET fullname='fullname', email='email', password='password' WHERE id=1"
  );
});

test('result.query is `DELETE FROM users`', async (t) => {
  const result = await db.table('users').where().del();

  t.is(
    result.query,
    'DELETE FROM users'
  );
});

test('result.query is `DELETE FROM users WHERE "id" = 1`', async (t) => {
  const result = await db.table('users').where({ id: 1 }).del();

  t.is(
    result.query,
    'DELETE FROM users WHERE "id" = 1'
  );
});
