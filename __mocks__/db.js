let db = jest.fn()

db.one = jest.fn().mockImplementation((query, vars) => {
	return Promise.resolve(null)
})

module.exports = db;
