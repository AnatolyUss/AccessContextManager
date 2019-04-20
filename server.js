'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const Dal = require('./lib/Dal');
const routes = require('./routes/index');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

Dal.init(config.get('databaseConfig'));

app.use('/', routes);

app.listen(port, () => {
  console.log(`[${app.settings.env}] Listening on http://localhost:${port}`);
});
