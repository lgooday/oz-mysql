import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

import * as sinon from 'sinon'
import { DB, poolFactory } from '.'
import * as mysql from 'promise-mysql'

chai.use(chaiAsPromised)
const expect = chai.expect

interface dbRes {
    id: string
}

describe('db test', function () {
    let poolStub: sinon.SinonStub

    afterEach(() => {
        poolStub.restore()
    })

    it('poolFactory ok', async () => {
        poolStub = sinon.stub(mysql, 'createPool').resolves()
        const pool = await poolFactory({})
        expect(pool).to.be.not.null
    })

    it('poolFactory ko', async () => {
        poolStub = sinon.stub(mysql, 'createPool').rejects()
        expect(poolFactory({})).to.be.rejectedWith(Error)
    })

    it('DB constructor', async () => {
        const pool: any = {}
        const db = new DB(pool)
        expect(db.ready()).to.be.true
    })

    it('DB close ok', async () => {
        const pool: any = {
            end: sinon.spy(),
        }
        const db = new DB(pool)
        await db.close()

        expect(pool.end.calledOnce).to.be.true
        expect(db.ready()).to.be.false
    })

    it('DB close ko', async () => {
        const pool: any = {
            end: Promise.reject,
        }
        const db = new DB(pool)
        expect(db.close()).to.be.rejected
        expect(db.ready()).to.be.false
    })

    it('queryAll ok', async () => {
        const pool: any = {
            query: sinon.spy(),
        }
        const db = new DB(pool)
        await db.queryAll('')
        expect(pool.query.calledOnce).to.be.true
    })

    it('queryAll ok - results', async () => {
        const pool: any = {
            query: () => Promise.resolve([{ id: '0' }, { id: '1' }]),
        }
        const db = new DB(pool)
        const res = await db.queryAll('')
        expect(res.length).to.eq(2)
    })

    it('queryAll ko', async () => {
        const pool: any = {
            end: Promise.reject,
        }
        const db = new DB(pool)
        expect(db.queryAll('')).to.be.rejected
    })

    it('queryOne ok - one result', async () => {
        const pool: any = {
            query: () => Promise.resolve([{ id: '0' }]),
        }
        const db = new DB(pool)
        const res = await db.queryOne<dbRes>('')
        expect(res.id).to.eq('0')
    })

    it('queryOne ko - many result', async () => {
        const pool: any = {
            query: () => Promise.resolve([{ id: '0' }, { id: '1' }]),
        }
        const db = new DB(pool)
        expect(db.queryOne('')).to.be.rejectedWith(Error, 'query returned more than one row')
    })

    it('queryOne ok - no results - should reject', async () => {
        const pool: any = {
            query: () => Promise.resolve([]),
        }
        const db = new DB(pool)
        expect(db.queryOne('', null, true)).to.be.rejectedWith(Error, 'query returned 0 row')
    })

    it('queryOne ok - no results - should resolve', async () => {
        const pool: any = {
            query: () => Promise.resolve([]),
        }
        const db = new DB(pool)
        const res = await db.queryOne<dbRes>('', null, false)
        expect(res).to.be.null
    })
})
