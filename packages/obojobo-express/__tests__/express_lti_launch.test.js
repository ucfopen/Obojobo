jest.mock('../models/user')
jest.mock('../db')

// array of mocked express middleware request arguments
let mockArgs = (withLtiData = false) => {
	let res = {}
	let req = {
		session: {},
		connection: { remoteAddress: '1.1.1.1' },
		params: {
			draftId: '999'
		}
	}
	let mockJson = jest.fn().mockImplementation(obj => {
		return true
	})
	res.status = jest.fn().mockImplementation(code => {
		return { json: mockJson }
	})
	let mockNext = jest.fn()
	req.setCurrentUser = jest.fn()

	if (withLtiData) {
		req.lti = {
			body: {
				lis_person_sourcedid: '555',
				lis_person_sourcedid: '2020',
				lis_person_contact_email_primary: 'mann@internet.com',
				lis_person_name_given: 'Hugh',
				lis_person_name_family: 'Mann',
				roles: ['saviour', 'explorer', 'doctor']
			}
		}
	}
	return [res, req, mockJson, res.status, mockNext]
}

let mockDBForLaunch = (resolveInsert = true, resolveEvent = true) => {
	let db = oboRequire('db')

	// mock the launch insert
	if (resolveInsert) {
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve({ id: 88 })
		})
	} else {
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.reject('launch insert error')
		})
	}

	// mock the event insert
	if (resolveEvent) {
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve('createdAt')
		})
	} else {
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.reject('event insert error')
		})
	}

	return db
}

describe('lti launch middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('calls next with no lti data', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()
		oboRequire('express_lti_launch').assignment(req, res, mockNext)
		expect(mockNext).toBeCalledWith()
	})

	it('inserts data correctly with lti data', () => {
		expect.assertions(2)

		let db = mockDBForLaunch()

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs(true)
		return oboRequire('express_lti_launch')
			.assignment(req, res, mockNext)
			.then(() => {
				expect(db.one.mock.calls[0][1]).toEqual(
					expect.objectContaining({
						data: {
							lis_person_contact_email_primary: 'mann@internet.com',
							lis_person_name_family: 'Mann',
							lis_person_name_given: 'Hugh',
							lis_person_sourcedid: '2020',
							roles: ['saviour', 'explorer', 'doctor']
						},
						draftId: '999',
						userId: 0
					})
				)
				expect(db.one.mock.calls[1][1]).toEqual(
					expect.objectContaining({
						action: 'lti:launch',
						actorTime: expect.any(String),
						draftId: '999',
						ip: '1.1.1.1',
						metadata: {},
						payload: {
							launchId: 88
						},
						userId: 0
					})
				)
			})
	})

	it('calls next with lti data', () => {
		expect.assertions(1)

		mockDBForLaunch()

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs(true)
		return oboRequire('express_lti_launch')
			.assignment(req, res, mockNext)
			.then(() => {
				expect(mockNext).toBeCalledWith()
			})
	})

	it('calls next error with lti data when insert event fails', () => {
		expect.assertions(1)

		mockDBForLaunch(true, false)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs(true)
		return oboRequire('express_lti_launch')
			.assignment(req, res, mockNext)
			.then(() => {
				expect(mockNext).toBeCalledWith(expect.any(Error))
			})
	})

	it('calls next error with lti data when insert event fails', () => {
		expect.assertions(1)

		mockDBForLaunch(false, false)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs(true)
		return oboRequire('express_lti_launch')
			.assignment(req, res, mockNext)
			.then(() => {
				expect(mockNext).toBeCalledWith(expect.any(Error))
			})
	})

	it('sets the current user', () => {
		expect.assertions(2)

		mockDBForLaunch()
		let User = oboRequire('models/user')

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs(true)
		return oboRequire('express_lti_launch')
			.assignment(req, res, mockNext)
			.then(() => {
				expect(req.setCurrentUser).toBeCalledWith(expect.any(User))
				expect(req.setCurrentUser).toBeCalledWith(
					expect.objectContaining({
						username: '2020',
						email: 'mann@internet.com',
						firstName: 'Hugh',
						lastName: 'Mann',
						roles: expect.any(Array)
					})
				)
			})
	})
})
