import * as mysql from 'promise-mysql'

class DB {

    private pool: mysql.Pool

    async init(conf: mysql.PoolConfig){
        this.pool = await mysql.createPool(conf)
    }

    close(): any{
        return this.pool.end()
    }

    async queryAll(query: string, params: any, tag: string = null){
        return this.pool.query(query, params)
    }
    
    async queryOne(query: string, params: any, rejectOnNotFound: boolean = false, tag: string = null){
        return this.pool.query(query, params)
            .then(
                rows => {
                    if (rows) {
                        if (!rows.length) {
                            if (rejectOnNotFound) {
                                return Promise.reject(new Error('query returned 0 row'))
                            }
                            return Promise.resolve()
                        } else if (rows.length === 1) {
                            return rows[0]
                        } else {
                            return Promise.reject(new Error('query returned more than one row'))
                        }
                    }
                }
            )
    }
}

export default new DB()