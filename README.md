# @hamjs/query-builder
SQL query builder for NodeJS

## Compatibility
This query builder is compatible with following Database Management Systems.
- MySQL/MariaDB via [mysql2](https://www.npmjs.com/package/mysql2)
- PostgreSQL via [pg](https://www.npmjs.com/package/pg)

## Installation
You can install by run this command inside your project by using terminal.
```bash
npm i https://github.com/hadihammurabi/hamjs-query-builder
```

## Usage
Type this following lines in your `.js` file and you can run it.
```javascript
const Database = require('@hamjs/query-builder');
const db = new Database({
  dialect: 'mysql',
  username: 'root',
  password: 'root',
});

console.log(db.getDialect());
```
It will give you `mysql` (your dialect) as output.

> As dialect you choose, it have to installed first.
>
> Example:
>  - `npm install mysql` for mysql
>  - `npm install pg` for pg
