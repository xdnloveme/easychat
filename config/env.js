'use strict'
module.exports = {
  DEBUG: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '*' : null,
  PORT: 3003
}
