let db = jest.fn()

db.one = jest.fn()
db.one.mockImplementation((query, vars) => {
	return Promise.resolve(null)
})

db.any = jest.fn()
db.any.mockImplementation((query, vars) => {
	return Promise.resolve(null)
})

module.exports = db;
