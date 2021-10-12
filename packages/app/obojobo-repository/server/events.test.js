describe('Server Events', () => {
	jest.mock('obojobo-express/server/logger')
	jest.mock('obojobo-express/server/obo_events')
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/models/draft')
	jest.mock('../../obojobo-express/server/public/compiled/manifest.json', () => ({}), {
		virtual: true
	})

	let oboEvents
	let DraftModel
	let db

	beforeEach(() => {
		jest.resetModules()
		oboEvents = require('obojobo-express/server/obo_events')
		DraftModel = require('obojobo-express/server/models/draft')
		db = require('obojobo-express/server/db')
		require('./events')
	})

	test('registers expected listeners', () => {
		const oboEvents = require('obojobo-express/server/obo_events')
		const DraftModel = require('obojobo-express/server/models/draft')

		require('./events')

		expect(oboEvents.on).toHaveBeenCalledTimes(4)
		expect(oboEvents.on).toHaveBeenCalledWith('HTTP_NOT_AUTHORIZED', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith('HTTP_NOT_FOUND', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith('HTTP_UNEXPECTED', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith(
			DraftModel.EVENT_NEW_DRAFT_CREATED,
			expect.any(Function)
		)
		expect(oboEvents.on).toHaveBeenCalledWith(DraftModel.EVENT_DRAFT_DELETED, expect.any(Function))
	})

	test("maps a user to a module when it's created", () => {
		// verify we have the right callback
		const [eventName, newDraftListener] = oboEvents.on.mock.calls[0]
		expect(eventName).toBe(DraftModel.EVENT_NEW_DRAFT_CREATED)
		expect(newDraftListener.length).toBe(1) // callback function arguments
		expect(db.none).toHaveBeenCalledTimes(0)

		// call the callback
		newDraftListener({ id: 2, user_id: 3 })
		expect(db.none).toHaveBeenCalledTimes(1)
		expect(db.none.mock.calls[0][0]).toContain('INSERT INTO repository_map_user_to_draft')
	})

	test('HTTP_NOT_AUTHORIZED events render a page', () => {
		// verify we have the right callback
		const [eventName, notAuthorizedListener] = oboEvents.on.mock.calls[1]
		expect(eventName).toBe('HTTP_NOT_AUTHORIZED')
		expect(notAuthorizedListener.length).toBe(1) // callback function arguments

		const mockReq = {
			getCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: {}
		}

		const mockRes = {
			render: jest.fn()
		}

		// call the callback
		return notAuthorizedListener({ req: mockReq, res: mockRes, next: jest.fn() }).then(() => {
			expect(mockReq).toHaveProperty('responseHandled', true)
			expect(mockRes.render).toHaveBeenCalled()
		})
	})

	test('HTTP_NOT_FOUND events render a page', () => {
		// verify we have the right callback
		const [eventName, notFoundListener] = oboEvents.on.mock.calls[2]
		expect(eventName).toBe('HTTP_NOT_FOUND')
		expect(notFoundListener.length).toBe(1) // callback function arguments

		const mockReq = {
			getCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: {}
		}

		const mockRes = {
			render: jest.fn()
		}

		// call the callback
		return notFoundListener({ req: mockReq, res: mockRes, next: jest.fn() }).then(() => {
			expect(mockReq).toHaveProperty('responseHandled', true)
			expect(mockRes.render).toHaveBeenCalled()
		})
	})

	test('HTTP_UNEXPECTED events render a page', () => {
		// verify we have the right callback
		const [eventName, unexpectedListener] = oboEvents.on.mock.calls[3]
		expect(eventName).toBe('HTTP_UNEXPECTED')
		expect(unexpectedListener.length).toBe(1) // callback function arguments

		const mockReq = {
			getCurrentUser: jest.fn().mockResolvedValue(),
			currentUser: {}
		}

		const mockRes = {
			render: jest.fn()
		}

		// call the callback
		return unexpectedListener({ req: mockReq, res: mockRes, next: jest.fn() }).then(() => {
			expect(mockReq).toHaveProperty('responseHandled', true)
			expect(mockRes.render).toHaveBeenCalled()
		})
	})
})
