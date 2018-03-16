'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promiseMysql = require('promise-mysql');

var _promiseMysql2 = _interopRequireDefault(_promiseMysql);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = void 0;

var init = function init(conf) {
	pool = _promiseMysql2.default.createPool(conf);
};

var getConnection = function getConnection() {
	return pool.getConnection().disposer(function (connection) {
		console.log('disposing');
		pool.releaseConnection(connection);
	});
};

var dq = function dq(query, params, tag) {
	// eslint-disable-line no-unused-vars
	return _bluebird2.default.using(getConnection(), function (connection) {
		return connection.query(query, params);
	});
};

var dqf = function dqf(query, params, tag) {
	// eslint-disable-line no-unused-vars
	return _bluebird2.default.using(getConnection(), function (connection) {
		return connection.query(query, params).then(function (rows) {
			if (rows && rows.length === 1) {
				return rows[0];
			}

			return _bluebird2.default.reject(new Error('not 1 item returned'));
		});
	});
};

var close = function close() {
	return pool.end();
};

exports.default = {
	init: init,
	dq: dq,
	dqf: dqf,
	close: close
};