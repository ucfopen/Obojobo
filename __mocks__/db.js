// NOTE: these are all 2 lines
// because mockReset() will clear
// jest.fn().mockImplementation()

let db = jest.fn()

db.one = jest.fn()
db.one.mockResolvedValue()

db.oneOrNone = jest.fn()
db.oneOrNone.mockResolvedValue()

db.manyOrNone = jest.fn()
db.oneOrNone.mockResolvedValue()

db.any = jest.fn()
db.any.mockResolvedValue()

db.none = jest.fn()
db.none.mockResolvedValue()

db.tx = jest.fn()
db.tx.mockImplementation(
	cb =>
		new Promise((resolve, reject) => {
			resolve(cb(db))
		})
)

db.batch = jest.fn()
db.batch.mockImplementation(queries => Promise.all(queries))

module.exports = db
