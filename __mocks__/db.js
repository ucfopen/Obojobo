let db = jest.fn()

db.one = jest.fn()
db.one.mockImplementation(() => Promise.resolve())

db.oneOrNone = jest.fn()
db.oneOrNone.mockImplementation(() => Promise.resolve())

db.manyOrNone = jest.fn()
db.oneOrNone.mockImplementation((query, vars) => {
	return Promise.resolve(null)
})

db.any = jest.fn()
db.any.mockImplementation(() => Promise.resolve())

db.none = jest.fn()
db.none.mockImplementation(() => Promise.resolve())

module.exports = db
