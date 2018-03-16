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
		pool.releaseConnection(connection);
	});
};

var queryAll = function queryAll(query, params, tag) {
	// eslint-disable-line no-unused-vars
	return _bluebird2.default.using(getConnection(), function (connection) {
		return connection.query(query, params);
	});
};

var queryOne = function queryOne(query, params) {
	var rejectOnNotFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var tag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	// eslint-disable-line no-unused-vars
	return _bluebird2.default.using(getConnection(), function (connection) {
		return connection.query(query, params).then(function (rows) {
			if (rows) {
				if (!rows.length) {
					if (rejectOnNotFound) {
						return _bluebird2.default.reject(new Error('query returned 0 row'));
					}
					return _bluebird2.default.resolve();
				} else if (rows.length === 1) {
					// eslint-disable-line no-else-return
					return rows[0];
				} else {
					return _bluebird2.default.reject(new Error('query returned more than one row'));
				}
			}
		});
	});
};

var close = function close() {
	return pool.end();
};

exports.default = {
	init: init,
	queryAll: queryAll,
	queryOne: queryOne,
	close: close
};