import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import NavStore from '../../../src/scripts/viewer/stores/nav-store'
import APIUtil from '../../../src/scripts/viewer/util/api-util'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return {
		postEvent: jest.fn()
	}
})

describe('NavUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()

		NavStore.init()
	})

	test('Should trigger nav:redAlert', () => {
		NavUtil.setRedAlert(false)

		//NavStore.init() will call setRedAlert to set it with false?
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('nav:redAlert', {
			value: {
				alertStatus: false
			}
		})
	})

	test('Should return red alert state', () => {
		let trueState = NavUtil.isRedAlertEnabled({
			items: {},
			itemsById: {},
			itemsByPath: {},
			itemsByFullPath: {},
			navTargetHistory: [],
			navTargetId: null,
			locked: false,
			open: true,
			redAlert: true
		})

		let falseState = NavUtil.isRedAlertEnabled({
			items: {},
			itemsById: {},
			itemsByPath: {},
			itemsByFullPath: {},
			navTargetHistory: [],
			navTargetId: null,
			locked: false,
			open: true,
			redAlert: false
		})

		expect(trueState).toEqual(true)
		expect(falseState).toEqual(false)
	})
})
