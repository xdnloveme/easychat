'use strict'
const env = require('./env');

Object.keys(env).map(item => {
	process.env[item] = env[item]
})
