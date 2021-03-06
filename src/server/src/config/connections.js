/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.connections.html
 */

'use strict';

module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },

  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/
  localMysqlServer: {
    adapter: 'sails-mysql',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'boilerplate_v2'
  },

  localMongoDbServer: {
    adapter: 'sails-mongo',
    host: 'localhost',
    port: 27017,
    database: 'boilerplate_v2',

    /* fix for sails-mongo@0.11.1
    *  will be deprecated in version 0.11.2
    * */
    poolSize: 5,
    socketOptions: {
      noDelay: true,
      connectTimeoutMS: 0,
      socketTimeoutMS: 0
    }
  },

  /***************************************************************************
   *                                                                          *
   * CouchDb is a document-oriented NoSQL database that uses JSON to store    *
   * data, JavaScript as its query language using MapReduce,                  *
   * and HTTP for an API.                                                     *
   * http://en.wikipedia.org/wiki/CouchDB                                     *
   *                                                                          *
   * Run: npm install sails-couchdb-orm                                       *
   *                                                                          *
   ***************************************************************************/
  localCouchDbServer: {
    adapter: 'sails-couchdb-orm',
    host: 'localhost',
    port: 5984,
    database: 'boilerplate_v2'
  },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
  somePostgresqlServer: {
    adapter: 'sails-postgresql',
    host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
    user: 'YOUR_POSTGRES_USER',
    password: 'YOUR_POSTGRES_PASSWORD',
    database: 'YOUR_POSTGRES_DB'
  }

  /***************************************************************************
  *                                                                          *
  * More adapters: https://github.com/balderdashy/sails                      *
  *                                                                          *
  ***************************************************************************/

};
