const util = require('util');
const { HTTP_CODE, SERVICE_CODE } = require('./message');

const ERROR_MSG_DEFAULT = Object.assign({}, HTTP_CODE, SERVICE_CODE);

function ServiceError (code, msg, data = null) {
  Error.call(this, '')
  
  this.code = code
  this.msg = msg || ERROR_MSG_DEFAULT[code] || 'error';
  this.data = data;
  this.getCodeMsg = function () {
    return {
      code: this.code,
      msg: this.msg,
      data: this.data
    }
  }
}

util.inherits(ServiceError, Error)

function HttpError (code, msg) {
  if (Object.keys(HTTP_CODE).indexOf(code.toString()) < 0) {
    throw Error('not an invalid http code')
  }
  ServiceError.call(this, code, msg)
}

util.inherits(HttpError, ServiceError)

module.exports = {
  HttpError,
  ServiceError
}
