jest.mock('../viewer/viewer_state', () => ({ set: jest.fn() }))
jest.mock('../obo_events', () => ({ on: jest.fn(), emit: jest.fn() }))

const vs = oboRequire('viewer/viewer_state')
const mockEvent = { userId: 1, draftId: 2 }
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
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isLocked', 1, true)
	})

	//@TODO: Unskip when nav:lock is being stored
	test.skip('client:nav:unlock', () => {
		oboEvents.emit(`client:nav:unlock`, mockEvent)
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isLocked', 1, false)
	})

	test('client:nav:open', () => {
		let clientNavOpen = oboEvents.on.mock.calls[0][1]
		clientNavOpen({ userId: 1, draftId: 6 })
		expect(vs.set).toBeCalledWith(1, 6, 'nav:isOpen', 1, true)
	})

	test('client:nav:close', () => {
		let clientNavClose = oboEvents.on.mock.calls[1][1]
		clientNavClose({ userId: 1, draftId: 6 })
		expect(vs.set).toBeCalledWith(1, 6, 'nav:isOpen', 1, false)
	})

	test('client:nav:toggle', () => {
		let clientNavToggle = oboEvents.on.mock.calls[2][1]
		clientNavToggle({ userId: 1, draftId: 6, payload: { open: 'yep' } })
		expect(vs.set).toBeCalledWith(1, 6, 'nav:isOpen', 1, 'yep')
	})
})
