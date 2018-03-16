import mysql from 'promise-mysql'
import Promise from 'bluebird'

let pool

const init = conf => {
	pool = mysql.createPool(conf)
}

const getConnection = () => {
	return pool.getConnection().disposer(connection => {
		console.log('disposing')
		pool.releaseConnection(connection)
	})
}

const dq = (query, params, tag) => { // eslint-disable-line no-unused-vars
	return Promise.using(getConnection(), connection => {
		return connection.query(query, params)
	})
}

const dqf = (query, params, tag) => { // eslint-disable-line no-unused-vars
	return Promise.using(getConnection(), connection => {
		return connection.query(query, params)
			.then(
				rows => {
					if (rows && rows.length === 1) {
						return rows[0]
					}

					return Promise.reject(new Error('not 1 item returned'))
				}
			)
	})
}

const close = () => {
	return pool.end()
}

export {
	init,
	dq,
	dqf,
	close
}
