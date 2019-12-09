/**
 * @file 服务器主入口
 * @author tangyida <530063113@qq.com>
 */
const app = require('../src/app.js');
const http = require('http');

const debug = require('debug')('easychat:server');

const server = http.createServer(app.callback());

/**
 * Get port
 */
const port = normalizePort(process.env.PORT || '3000');

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * HTTP Listening error events
 **/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * HTTP Listening onListening events
 **/


function onListening(error) {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('start running, Listening on ' + bind);
}

module.exports = server;