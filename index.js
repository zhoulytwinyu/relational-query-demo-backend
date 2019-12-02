const SqlBuilder = require('relational-query-sql-builder');
const sqlite3 = require('sqlite-async');
const express = require('express');
const cors = require('cors');
const databaseConfig = require('./config/database.js');
const webServerConfig = require('./config/web-server.js');
const relationalQueryConfig = require('./config/relational-query.js');

async function run(){
  const database = await sqlite3.open(databaseConfig.FILE_NAME);
  const app = express();
  const sqlBuilder = new SqlBuilder(relationalQueryConfig.SCHEMA);
  
  app.use(express.json());
  app.use(cors());
  
  app.post('/api/relational-query', async (req, res) => {
    try{
      let query = req.body;
      let entitySql = sqlBuilder.buildSQL(query);
      let ret = {};
      for (let [entity,[sql,binds]] of Object.entries(entitySql)) {
        ret[entity] = await database.all(sql,binds);
      }
      res.send(ret);
    }
    catch(err) {
      res.status(500).send(err.toString());
    }
  });

  let server = app.listen(
    webServerConfig.PORT,
    () => console.log(`Listening on port ${webServerConfig.PORT}.`)
  );

  process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    process.exit(128);
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT');
    process.exit(128);
  });


  process.on('uncaughtException', err => {
    console.log(err);
    process.exit(1);
  });

  process.on('exit', () => {
    console.log("Exit");
    server.close();
    database.close();
  });
}

run();
