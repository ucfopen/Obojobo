class MockVisit {
	constructor(visitProps) {
		// expand all the visitProps onto this object
		for (let prop in visitProps) {
			this[prop] = visitProps[prop]
		}
	}
}

MockVisit.fetchById = jest.fn().mockResolvedValue(new MockVisit())
MockVisit.createVisit = jest.fn().mockResolvedValue(new MockVisit())
MockVisit.createPreviewVisit = jest.fn().mockResolvedValue(new MockVisit())

module.exports = MockVisit
