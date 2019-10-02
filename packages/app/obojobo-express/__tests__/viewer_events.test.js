jest.mock('../config')
jest.mock('../viewer/viewer_state', () => ({ set: jest.fn() }))
jest.mock('../obo_events', () => ({ on: jest.fn(), emit: jest.fn() }))
jest.mock('../models/visit')
jest.mock('../util/purge_data')

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

describe('viewer events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetModules()
		vs = oboRequire('viewer/viewer_state')
		oboEvents = oboRequire('obo_events')
		VisitModel = oboRequire('models/visit')
	})
	afterEach(() => {})

	test('registers expected events', () => {
		expect(oboEvents.on).not.toBeCalled()

		ve = oboRequire('viewer_events')
		expect(oboEvents.on).toBeCalledWith('client:nav:open', expect.any(Function))
		expect(oboEvents.on).toBeCalledWith('client:nav:close', expect.any(Function))
		expect(oboEvents.on).toBeCalledWith('client:nav:toggle', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledTimes(3)
	})

	test('executes next when included to support express middleware', () => {
		ve = oboRequire('viewer_events')
		const mockNext = jest.fn()
		ve({}, {}, mockNext)
		expect(mockNext).toBeCalled()
	})

	test('client:nav:open', () => {
		expect.hasAssertions()
		ve = oboRequire('viewer_events')

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
		ve = oboRequire('viewer_events')

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

	test('client:nav:toggle', () => {
		expect.hasAssertions()
		ve = oboRequire('viewer_events')

		const [eventName, callback] = oboEvents.on.mock.calls[2]
		expect(eventName).toBe('client:nav:toggle')
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
				'yep',
				'mockResourceLinkId'
			)
		})
	})

	test('doesnt register purge data when disabled', () => {
		expect.hasAssertions()
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		isPurgeEnabled.mockReturnValueOnce(false)
		ve = oboRequire('viewer_events')
		expect(oboEvents.on).not.toHaveBeenCalledWith('server:lti:user_launch', expect.anything())
	})

	test('doesnt register purge data when is undefined', () => {
		expect.hasAssertions()
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		isPurgeEnabled.mockReturnValueOnce(undefined) //eslint-disable-line no-undefined
		ve = oboRequire('viewer_events')
		expect(oboEvents.on).not.toHaveBeenCalledWith('server:lti:user_launch', expect.anything())
	})

	test('does register when purge data is enabled', () => {
		expect.hasAssertions()
		const { isPurgeEnabled } = oboRequire('util/purge_data')
		isPurgeEnabled.mockReturnValue(true)
		ve = oboRequire('viewer_events')
		expect(oboEvents.on).toHaveBeenCalledWith('server:lti:user_launch', expect.anything())
	})

	test('purge data callback calls purgeData', () => {
		expect.hasAssertions()
		const { isPurgeEnabled, purgeData } = oboRequire('util/purge_data')
		purgeData.mockResolvedValueOnce(true)
		isPurgeEnabled.mockReturnValue(true)
		ve = oboRequire('viewer_events')

		const [eventName, callback] = oboEvents.on.mock.calls[3]
		expect(eventName).toBe('server:lti:user_launch')
		expect(callback).toHaveLength(0) // callback has 0 arguments
		expect(purgeData).not.toHaveBeenCalled()

		return callback(mockEvent).then(() => {
			expect(purgeData).toHaveBeenCalled()
		})
	})
})
