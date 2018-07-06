jest.mock('../viewer/viewer_state', () => ({ set: jest.fn() }))
jest.mock('../obo_events', () => ({ on: jest.fn(), emit: jest.fn() }))

const vs = oboRequire('viewer/viewer_state')
const mockEvent = {
	userId: 'mockUserId',
	draftId: 'mockDraftId',
	contentId: 'mockContentId'
}
let ve
let oboEvents

describe('viewer events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		ve = oboRequire('viewer_events')
		oboEvents = oboRequire('obo_events')
	})
	afterEach(() => {})

	test('registers expected events', () => {
		expect(oboEvents.on).toBeCalledWith('client:nav:open', expect.any(Function))
		expect(oboEvents.on).toBeCalledWith('client:nav:close', expect.any(Function))
		expect(oboEvents.on).toBeCalledWith('client:nav:toggle', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledTimes(3)
	})

	test('executes next when included to support express middleware', () => {
		let mockNext = jest.fn()
		ve({}, {}, mockNext)
		expect(mockNext).toBeCalled()
	})

	//@TODO: Unskip when nav:lock is being stored
	test.skip('client:nav:lock', () => {
		oboEvents.emit(`client:nav:lock`, mockEvent)
		expect(vs.set).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'nav:isLocked',
			1,
			true
		)
	})

	//@TODO: Unskip when nav:lock is being stored
	test.skip('client:nav:unlock', () => {
		oboEvents.emit(`client:nav:unlock`, mockEvent)
		expect(vs.set).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'nav:isLocked',
			1,
			false
		)
	})

	test('client:nav:open', () => {
		let clientNavOpen = oboEvents.on.mock.calls[0][1]
		clientNavOpen(mockEvent)
		expect(vs.set).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'nav:isOpen',
			1,
			true
		)
	})

	test('client:nav:close', () => {
		let clientNavClose = oboEvents.on.mock.calls[1][1]
		clientNavClose(mockEvent)
		expect(vs.set).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'nav:isOpen',
			1,
			false
		)
	})

	test('client:nav:toggle', () => {
		let clientNavToggle = oboEvents.on.mock.calls[2][1]
		let mockPayloadEvent = {
			userId: 'mockUserId',
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			payload: { open: 'yep' }
		}
		clientNavToggle(mockPayloadEvent)
		expect(vs.set).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'nav:isOpen',
			1,
			'yep'
		)
	})
})
