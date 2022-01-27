/* eslint-disable no-undef */

jest.mock('../../../src/scripts/viewer/util/viewer-api')
jest.mock('../../../src/scripts/common/components/modal/no-button-modal')
jest.mock('sysend')
jest.mock('../../../src/scripts/common/index', () => ({
	flux: {
		Dispatcher: {
			trigger: jest.fn()
		}
	},
	util: {
		ModalUtil: {
			show: jest.fn()
		}
	}
}))

const Common = require('../../../src/scripts/common/index')
const StopViewer = require('../../../src/scripts/viewer/util/stop-viewer')
const ViewerAPI = require('../../../src/scripts/viewer/util/viewer-api').default
const sysend = require('sysend')
const ModalUtil = Common.util.ModalUtil
const Dispatcher = Common.flux.Dispatcher

describe('Stop Viewer', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.clearAllTimers()
		ViewerAPI.getVisitSessionStatus.mockResolvedValue({ status: 'ok' })
	})

	test('startHeartBeat loads session right away', () => {
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')
		expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalled()
	})

	test('startHeartBeat registers a sysend listener', () => {
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')
		expect(sysend.on).toHaveBeenCalledWith('viewer-init', expect.any(Function))
	})

	test('startHeartBeat broadcasts to other windows', () => {
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(sysend.broadcast).toHaveBeenCalledWith('viewer-init', {
				windowId: expect.any(Number),
				draftId: 'mock-draft-id'
			})
		})
	})

	test('startHeartBeat executes heartbeat on an interval', () => {
		jest.useFakeTimers()
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')

		// first call starts right away
		expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalledTimes(1)
		expect(ViewerAPI.getVisitSessionStatus.mock.calls[0][0]).toBe('mock-draft-id')

		// second call after the setInterval runs
		jest.advanceTimersByTime(20000)
		expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalledTimes(2)
		expect(ViewerAPI.getVisitSessionStatus.mock.calls[1][0]).toBe('mock-draft-id')
	})

	test('startHeartBeat sysend listener calls stopHeartBeat', () => {
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')

		expect(sysend.on).toHaveBeenCalled()
		expect(sysend.off).not.toHaveBeenCalled()

		// trigger sysend.on('viewer-init') to run stopViewer()
		const sysendListener = sysend.on.mock.calls[0][1]
		sysendListener({ windowId: 0, draftId: 'mock-draft-id' })
		expect(sysend.off).toHaveBeenCalledWith('viewer-init')
	})

	test('stopHeartBeat stops the interval', () => {
		jest.useFakeTimers()
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')

		// trigger sysend.on('viewer-init') to run stopViewer()
		const sysendListener = sysend.on.mock.calls[0][1]
		sysendListener({ windowId: 0, draftId: 'mock-draft-id' })

		// first call starts right away
		expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalledTimes(1)
		jest.runOnlyPendingTimers()
		expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalledTimes(1)
	})

	test('sysend listener does nothing when triggered by same window', () => {
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(sysend.broadcast).toHaveBeenCalled()
			const windowId = sysend.broadcast.mock.calls[0][1].windowId

			const sysendListener = sysend.on.mock.calls[0][1]
			sysendListener({ windowId: windowId, draftId: 'mock-draft-id' })
			expect(sysend.off).not.toHaveBeenCalledWith('viewer-init')
		})
	})

	test('sysend listener calls stopHeartBeat triggered by a different window', () => {
		expect.hasAssertions()
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(sysend.broadcast).toHaveBeenCalled()

			const sysendListener = sysend.on.mock.calls[0][1]
			sysendListener({ windowId: 0, draftId: 'mock-draft-id' })
			expect(sysend.off).toHaveBeenCalledWith('viewer-init')
		})
	})

	test('executeHeartBeat stops the interval when status is not ok', () => {
		jest.useFakeTimers()
		expect.hasAssertions()
		ViewerAPI.getVisitSessionStatus.mockResolvedValueOnce({ status: 'error' })
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalledTimes(1)
			jest.runOnlyPendingTimers()
			expect(ViewerAPI.getVisitSessionStatus).toHaveBeenCalledTimes(1)
		})
	})

	test('executeHeartBeat shows modal when status is not ok', () => {
		jest.useFakeTimers()
		expect.hasAssertions()
		ViewerAPI.getVisitSessionStatus.mockResolvedValueOnce({ status: 'error' })
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(ModalUtil.show).toHaveBeenCalledWith(expect.anything(), true)
		})
	})

	test('executeHeartBeat dispatches when status is not ok', () => {
		jest.useFakeTimers()
		expect.hasAssertions()
		ViewerAPI.getVisitSessionStatus.mockResolvedValueOnce({ status: 'error' })
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:duplicateOpen')
		})
	})

	test('executeHeartBeat broadcasts even when statis is not ok', () => {
		jest.useFakeTimers()
		expect.hasAssertions()
		ViewerAPI.getVisitSessionStatus.mockResolvedValueOnce({ status: 'error' })
		StopViewer.startHeartBeat('mock-draft-id')

		return flushPromises().then(() => {
			expect(sysend.broadcast).toHaveBeenCalled()
		})
	})
})
