jest.mock('../server/config')
jest.mock('../server/viewer/viewer_state', () => ({ set: jest.fn() }))
jest.mock('../server/obo_events', () => ({ on: jest.fn(), emit: jest.fn() }))
jest.mock('../server/models/visit')
jest.mock('./db')
jest.mock('../server/logger')

const mockEvent = {
	userId: 'mockUserId',
	draftId: 'mockDraftId',
	contentId: 'mockContentId',
	visitId: 'mockVisitId',
	payload: {
		open: 'yep'
	}
}
let vs
let ve
let oboEvents
let VisitModel
let db
let logger

describe('viewer events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()
		db = oboRequire('db')
		logger = oboRequire('logger')
		vs = oboRequire('server/viewer/viewer_state')
		oboEvents = oboRequire('server/obo_events')
		VisitModel = oboRequire('server/models/visit')
	})
	afterEach(() => {})

	test('registers expected events', () => {
		expect(oboEvents.on).not.toBeCalled()

		ve = oboRequire('server/viewer/viewer_events')
		expect(oboEvents.on).toBeCalledWith('client:nav:open', expect.any(Function))
		expect(oboEvents.on).toBeCalledWith('client:nav:close', expect.any(Function))
		expect(oboEvents.on).toBeCalledWith('client:nav:setRedAlert', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledTimes(3)
	})

	test('executes next when included to support express middleware', () => {
		ve = oboRequire('server/viewer/viewer_events')
		const mockNext = jest.fn()
		ve({}, {}, mockNext)
		expect(mockNext).toBeCalled()
	})

	test('client:nav:open', () => {
		expect.hasAssertions()
		ve = oboRequire('server/viewer/viewer_events')

		const [eventName, callback] = oboEvents.on.mock.calls[0]
		expect(eventName).toBe('client:nav:open')
		expect(callback).toHaveLength(1) // callback has 1 argument

		VisitModel.fetchById.mockResolvedValueOnce({
			resource_link_id: 'mockResourceLinkId'
		})

		expect(vs.set).not.toHaveBeenCalled()
		return callback(mockEvent).then(() => {
			expect(vs.set).toBeCalledWith(
				'mockUserId',
				'mockDraftId',
				'mockContentId',
				'nav:isOpen',
				1,
				true,
				'mockResourceLinkId'
			)
		})
	})

	test('client:nav:close', () => {
		expect.hasAssertions()
		ve = oboRequire('server/viewer/viewer_events')

		const [eventName, callback] = oboEvents.on.mock.calls[1]
		expect(eventName).toBe('client:nav:close')
		expect(callback).toHaveLength(1) // callback has 1 argument

		VisitModel.fetchById.mockResolvedValueOnce({
			resource_link_id: 'mockResourceLinkId'
		})

		expect(vs.set).not.toHaveBeenCalled()
		return callback(mockEvent).then(() => {
			expect(vs.set).toBeCalledWith(
				'mockUserId',
				'mockDraftId',
				'mockContentId',
				'nav:isOpen',
				1,
				false,
				'mockResourceLinkId'
			)
		})
	})

	test('client:nav:setRedAlert (insert success)', () => {
		expect.hasAssertions()

		db.none.mockResolvedValue(null)

		ve = oboRequire('viewer_events')
		const [eventName, callback] = oboEvents.on.mock.calls[2]
		expect(eventName).toBe('client:nav:setRedAlert')
		expect(callback).toHaveLength(1)

		const mockRedAlertEvent = {
			userId: 'mock-user-id',
			draftId: 'mock-draft-id',
			payload: { to: 'mock-is-red-alert-enabled' }
		}

		return callback(mockRedAlertEvent).then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(db.none).toBeCalledWith(
				expect.stringContaining('INSERT INTO red_alert_status'),
				expect.objectContaining({
					userId: mockRedAlertEvent.userId,
					draftId: mockRedAlertEvent.draftId,
					isRedAlertEnabled: true
				})
			)
		})
	})

	test('client:nav:setRedAlert (insert error)', () => {
		expect.hasAssertions()

		const message = 'error message'

		db.none.mockRejectedValue(message)

		ve = oboRequire('viewer_events')
		const [eventName, callback] = oboEvents.on.mock.calls[2]
		expect(eventName).toBe('client:nav:setRedAlert')
		expect(callback).toHaveLength(1)

		const mockRedAlertEvent = {
			userId: 'mock-user-id',
			draftId: 'mock-draft-id',
			payload: { to: 'mock-is-red-alert-enabled' }
		}

		return callback(mockRedAlertEvent).then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(logger.error).toHaveBeenCalledTimes(1)
			expect(db.none).toBeCalledWith(
				expect.stringContaining('INSERT INTO red_alert_status'),
				expect.objectContaining({
					userId: mockRedAlertEvent.userId,
					draftId: mockRedAlertEvent.draftId,
					isRedAlertEnabled: true
				})
			)
			expect(logger.error).toBeCalledWith('DB UNEXPECTED on red_alert_status.set', message, message)
		})
	})
})
