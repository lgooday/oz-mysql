import mysql from 'promise-mysql'
import Promise from 'bluebird'

let pool

const init = conf => {
	return mysql.createPool(conf).then(t => { pool = t })
}

const queryAll = (query, params, tag) => { // eslint-disable-line no-unused-vars
	return pool.query(query, params)
}

const queryOne = (query, params, rejectOnNotFound = false, tag = null) => { // eslint-disable-line no-unused-vars
		return pool.query(query, params)
			.then(
				rows => {
					if (rows) {
						if (!rows.length) {
							if (rejectOnNotFound) {
								return Promise.reject(new Error('query returned 0 row'))
							}
							return Promise.resolve()
						} else if (rows.length === 1) { // eslint-disable-line no-else-return
							return rows[0]
						} else {
							return Promise.reject(new Error('query returned more than one row'))
						}
					}
				}
			)
}

const query = (query, params, tag = null) => { // eslint-disable-line no-unused-vars
		return pool.query(query, params)
}

const close = () => {
	return pool.end()
}

export default {
	init,
	queryAll,
	queryOne,
	query,
	close
}