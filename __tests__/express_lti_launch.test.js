jest.mock('../insert_event')
jest.mock('../models/user')
jest.mock('../db')
jest.mock('../logger')

const insertEvent = oboRequire('insert_event')
const User = oboRequire('models/user')
const logger = oboRequire('logger')
const db = oboRequire('db')
const ltiLaunch = oboRequire('express_lti_launch')

// array of mocked express middleware request arguments
let mockExpressArgs = withLtiData => {
	let res = {}

	let req = {
		session: {},
		connection: { remoteAddress: '1.1.1.1' },
		params: {
			draftId: '999'
		},
		hostname: 'dummyhost',
		setCurrentUser: jest.fn()
	}

	let mockNext = jest.fn()

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
	return [req, res, mockNext]
}

describe('lti launch middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		insertEvent.mockReset()
		insertEvent.mockResolvedValue()
		db.one.mockReset()
		db.one.mockResolvedValue({ id: 88 })
		User.saveOrCreateCallback.mockReset()
		logger.error.mockReset()
	})
	afterEach(() => {})

	it('assignment returns a promise and short circuits to next if not a LTI request, skipping launch logic', () => {
		expect.assertions(2)
		let [req, res, mockNext] = mockExpressArgs(false)
		return ltiLaunch.assignment(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
			// next can be called in several places
			// make sure we're not getting into the logic
			// that creates users
			expect(User.saveOrCreateCallback).not.toHaveBeenCalled()
		})
	})

	it('assignment inserts data correctly with lti data', () => {
		expect.assertions(2)

		let [req, res, mockNext] = mockExpressArgs(true)
		return ltiLaunch.assignment(req, res, mockNext).then(() => {
			// tests to see if the launch is being stored
			// there's no external handles to the method
			// so we're watching db.one to see if it was inserted
			expect(db.one).toBeCalledWith(
				expect.stringContaining('INSERT INTO launches'),
				expect.objectContaining({
					data: {
						lis_person_contact_email_primary: 'mann@internet.com',
						lis_person_name_family: 'Mann',
						lis_person_name_given: 'Hugh',
						lis_person_sourcedid: '2020',
						roles: ['saviour', 'explorer', 'doctor']
					},
					draftId: '999',
					userId: 1
				})
			)

			// lets also make sure insert event is geting called
			// with the data we expec
			expect(insertEvent).toBeCalledWith(
				expect.objectContaining({
					action: 'lti:launch',
					actorTime: expect.any(String),
					draftId: '999',
					ip: '1.1.1.1',
					metadata: {},
					payload: {
						launchId: 88
					},
					userId: 1
				})
			)
		})
	})

	it('assignment returns a promise and short circuits to next if not a LTI request, skipping launch logic', () => {
		expect.assertions(2)

		let [req, res, mockNext] = mockExpressArgs(true)
		return ltiLaunch.assignment(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
			// next can be called in several places
			// make sure we're not getting caught by the logic
			// that bypasses everything
			expect(User.saveOrCreateCallback).toHaveBeenCalled()
		})
	})

	it('assignment calls next error with lti data when insert Launch fails', () => {
		expect.assertions(1)

		// mock insert launch fail
		db.one.mockRejectedValueOnce('launch insert error')

		let [req, res, mockNext] = mockExpressArgs(true)
		return ltiLaunch.assignment(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
		})
	})

	it('assignment calls next error with lti data when insert event fails', () => {
		expect.assertions(1)

		// mock insert event failure
		insertEvent.mockRejectedValueOnce('launch insert error')

		let [req, res, mockNext] = mockExpressArgs(true)
		return ltiLaunch.assignment(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
		})
	})

	it('assignment sets the current user', () => {
		expect.assertions(2)

		let [req, res, mockNext] = mockExpressArgs(true)
		return ltiLaunch.assignment(req, res, mockNext).then(() => {
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

	test('courseNavlaunch returns a promise and short circuits to next if not a LTI request, skipping launch logic', () => {
		expect.assertions(2)

		let [req, res, mockNext] = mockExpressArgs(false)
		return ltiLaunch.courseNavlaunch(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
			// next can be called in several places
			// make sure we're not getting into the logic
			// that creates users
			expect(User.saveOrCreateCallback).not.toHaveBeenCalled()
		})
	})

	test('courseNavlaunch creates a new user and calls req.setCurrentUser', () => {
		expect.assertions(4)

		let User = oboRequire('models/user')
		let createdUser

		User.saveOrCreateCallback.mockImplementationOnce(user => {
			createdUser = user
		})

		let [req, res, mockNext] = mockExpressArgs(true)

		return ltiLaunch.courseNavlaunch(req, res, mockNext).then(() => {
			// has saved that user
			expect(User.saveOrCreateCallback).toHaveBeenCalled()
			// has created a user object
			expect(createdUser).toHaveProperty('firstName')
			// that same user is now the current user
			expect(req.setCurrentUser).toBeCalledWith(createdUser)
			expect(mockNext).toBeCalledWith()
		})
	})

	test('courseNavlaunch logs an error if no LTI body and calls next with an error', () => {
		expect.assertions(4)

		User.saveOrCreateCallback.mockImplementationOnce(user => {
			throw 'this error'
		})
		let [req, res, mockNext] = mockExpressArgs(true)

		return ltiLaunch.courseNavlaunch(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))

			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(logger.error).toHaveBeenCalledWith('LTI Nav Launch Error', 'this error')
			expect(logger.error).toHaveBeenCalledWith('LTI Body', expect.any(Object))
		})
	})

	test('assignmentSelection returns a promise and short circuits to next if not a LTI request, skipping launch logic', () => {
		expect.assertions(2)

		let [req, res, mockNext] = mockExpressArgs(false)

		return ltiLaunch.assignmentSelection(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith()
			// next can be called in several places
			// make sure we're not getting into the logic
			// that creates users
			expect(User.saveOrCreateCallback).not.toHaveBeenCalled()
		})
	})
	test('assignmentSelection creates a new user and inserts an event', () => {
		expect.assertions(5)

		let createdUser
		User.saveOrCreateCallback.mockImplementationOnce(user => {
			createdUser = user
		})
		let [req, res, mockNext] = mockExpressArgs(true)

		return ltiLaunch.assignmentSelection(req, res, mockNext).then(() => {
			// has saved that user
			expect(User.saveOrCreateCallback).toHaveBeenCalled()
			// has created a user object
			expect(createdUser).toHaveProperty('firstName')
			// that same user is now the current user
			expect(req.setCurrentUser).toBeCalledWith(createdUser)
			expect(insertEvent).toHaveBeenCalledTimes(1)
			expect(mockNext).toBeCalledWith()
		})
	})

	test('assignmentSelection logs an error if user creation fails and calls next with an error', () => {
		expect.assertions(4)

		User.saveOrCreateCallback.mockImplementationOnce(user => {
			throw 'this error'
		})

		let [req, res, mockNext] = mockExpressArgs(true)

		return ltiLaunch.assignmentSelection(req, res, mockNext).then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(logger.error).toHaveBeenCalledWith('LTI Picker Launch Error', 'this error')
			expect(logger.error).toHaveBeenCalledWith('LTI Body', expect.any(Object))
		})
	})

	test('assignmentSelection logs an error if event insert fails and calls next with an error', () => {
		expect.assertions(5)

		insertEvent.mockRejectedValueOnce('event insert error')
		let [req, res, mockNext] = mockExpressArgs(true)

		return ltiLaunch.assignmentSelection(req, res, mockNext).then(() => {
			expect(User.saveOrCreateCallback).toHaveBeenCalled()
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(logger.error).toHaveBeenCalledWith('LTI Picker Launch Error', 'event insert error')
			expect(logger.error).toHaveBeenCalledWith('LTI Body', expect.any(Object))
		})
	})
})
