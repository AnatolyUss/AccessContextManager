'use strict';

const mongoose = require('mongoose');

/**
 * Simple data access layer.
 * @type {Dal}
 */
const Dal = class {
  /**
   * Initializes MongoDB connection.
   * @param {any} config
   * @returns {Mongoose.Connection}
   */
  static init (config) {
    console.log(`Trying to connect to ${config.host}/${config.database} MongoDB database`);

    const connectionString = `mongodb://${config.host}/${config.database}`;
    const options = {
      useNewUrlParser: true,
      promiseLibrary: global.Promise
    };

    mongoose.connect(connectionString, options);
    Dal._connection = mongoose.connection;

    Dal._connection
      .on('error', console.error.bind(console, 'connection error:'))
      .once('open', () => console.log('MongoDB connection open.'));

    return Dal._connection ;
  }

  /**
   * Closes MongoDB connection.
   * @returns {void}
   */
  static close () {
    if (Dal._connection) {
      conn.close(() => {
        console.log('Mongoose default connection disconnected through app termination.');
        process.exit();
      });
    }
  }
};

Dal._connection = null;

module.exports = Dal;
