const db = jest.fn()

db.one = jest.fn()
db.one.mockImplementation(() => Promise.resolve())

db.oneOrNone = jest.fn()
db.oneOrNone.mockImplementation(() => Promise.resolve())

db.manyOrNone = jest.fn()
db.oneOrNone.mockImplementation(() => Promise.resolve(null))

db.any = jest.fn()
db.any.mockImplementation(() => Promise.resolve())

db.none = jest.fn()
db.none.mockImplementation(() => Promise.resolve())

db.tx = jest.fn()
db.tx.mockImplementation(cb => cb(db))

db.batch = jest.fn()
db.batch.mockImplementation(queries => Promise.all(queries))

module.exports = db
