describe('Server Events', () => {
	jest.mock('obojobo-express/logger')
	jest.mock('obojobo-express/obo_events')
	jest.mock('obojobo-express/db')
	jest.mock('obojobo-express/models/draft')

	let oboEvents
	let DraftModel
	let db

	beforeEach(() => {
		jest.resetModules()
		oboEvents = require('obojobo-express/obo_events')
		DraftModel = require('obojobo-express/models/draft')
		db = require('obojobo-express/db')
		require('./events')
	})

	test('registers expected listeners', () => {
		const oboEvents = require('obojobo-express/obo_events')
		const DraftModel = require('obojobo-express/models/draft')

		require('./events')

		expect(oboEvents.on).toHaveBeenCalledTimes(5)
		expect(oboEvents.on).toHaveBeenCalledWith('HTTP_NOT_AUTHORIZED', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith('HTTP_NOT_FOUND', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith('HTTP_UNEXPECTED', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith(
			DraftModel.EVENT_NEW_DRAFT_CREATED,
			expect.any(Function)
		)
		expect(oboEvents.on).toHaveBeenCalledWith(DraftModel.EVENT_DRAFT_DELETED, expect.any(Function))
	})

	test('maps a user to a module when its created', () => {
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

	test('cleans ownership when a draft is deleted', () => {
		// verify we have the right callback
		const [eventName, deleteDraftListener] = oboEvents.on.mock.calls[1]
		expect(eventName).toBe(DraftModel.EVENT_DRAFT_DELETED)
		expect(deleteDraftListener.length).toBe(0) // callback function arguments
		expect(db.none).toHaveBeenCalledTimes(0)

		// call the callback
		deleteDraftListener()
		expect(db.none).toHaveBeenCalledTimes(1)
		expect(db.none.mock.calls[0][0]).toContain('DELETE FROM repository_map_user_to_draft')
	})

	test('HTTP_NOT_AUTHORIZED events render a page', () => {
		// verify we have the right callback
		const [eventName, notAuthorizedListener] = oboEvents.on.mock.calls[2]
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
		const [eventName, notFoundListener] = oboEvents.on.mock.calls[3]
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
		const [eventName, unexpectedListener] = oboEvents.on.mock.calls[4]
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
