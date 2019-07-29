import * as mysql from 'promise-mysql';
declare class DB {
    private pool;
    init(conf: mysql.PoolConfig): Promise<void>;
    close(): any;
    queryAll(query: string, params: any, tag?: string): Promise<any>;
    queryOne(query: string, params: any, rejectOnNotFound?: boolean, tag?: string): Promise<any>;
}
declare const _default: DB;
export default _default;
