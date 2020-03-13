# @hamjs/query-builder
SQL query builder for NodeJS

## Compatibility
This query builder is compatible with following Database Management Systems.
- MySQL via [mysql](https://www.npmjs.com/package/mysql)/[mysql2](https://www.npmjs.com/package/mysql2)
- MariaDB via [mariadb](https://www.npmjs.com/package/mariadb)
- PostgreSQL via [pg](https://www.npmjs.com/package/pg)

## Installation
You can install by run this command inside your project by using terminal.
```bash
npm i https://github.com/hadihammurabi/hamjs-query-builder
```

## Usage
### Connecting to database server
Type this following lines in your `.js` file and you can run it.
```javascript
const Database = require('@hamjs/query-builder');
const db = new Database({
  dialect: 'mysql',
  username: 'root',
  password: 'root',
  database: 'test',
});

console.log(db.getDialect());
```
It will give you `mysql` (your dialect) as output.

> As dialect you choose, it have to installed first.
>
> Example:
>  - `npm install mysql` for mysql
>  - `npm install mysql2` for mysql2
>  - `npm install pg` for pg

### Querying
#### Select
Getting all data (select query) can do by use following lines.
```javascript
...
db
  .table('users')
  .all()
  .then(console.log)
  .catch(console.log);

// prints all data in users table
```

Getting all data with specific column(s), see following example.
```javascript
...
db
  .table('users')
  .get('fullname', 'email', 'password')
  .then(console.log)
  .catch(console.log);

// prints all data in users table, but
// only fullname, email, and password columns
```

#### Insert
Inserting a data can do by use following lines.
```javascript
...
db
  .table('users')
  .insert([null, 'my fullname', 'example@email.top', 'mypass123'])
  .then(console.log)
  .catch(console.log);

// inserting data into users table
// prints insertion result
```
