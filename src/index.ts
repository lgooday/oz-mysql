import * as mysql from 'promise-mysql'

export class DB {
    constructor(private pool: mysql.Pool) {}

    ready() {
        return this.pool !== null
    }

    async close(): Promise<void> {
        try {
            await this.pool.end()
        } catch (e) {
            return Promise.reject(new Error(e))
        } finally {
            this.pool = null
        }
    }

    async queryAll<T>(query: string, params?: any, tag: string = null): Promise<T[]> {
        try {
            const results = this.pool.query(query, params)
            return results
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    async queryOne<T>(query: string, params?: any, rejectOnNotFound: boolean = false, tag: string = null): Promise<T> {
        return this.pool.query(query, params).then((rows) => {
            if (rows) {
                if (!rows.length) {
                    if (rejectOnNotFound) {
                        return Promise.reject(new Error('query returned 0 row'))
                    }
                    return Promise.resolve(null)
                } else if (rows.length === 1) {
                    return rows[0]
                } else {
                    return Promise.reject(new Error('query returned more than one row'))
                }
            }
        })
    }
}

export const poolFactory = async (conf: mysql.PoolConfig): Promise<mysql.Pool> => {
    try {
        const pool: mysql.Pool = await mysql.createPool(conf)
        return pool
    } catch (e) {
        return Promise.reject(new Error(e))
    }
}
