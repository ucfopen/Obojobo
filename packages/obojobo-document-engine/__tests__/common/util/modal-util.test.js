import ModalUtil from '../../../src/scripts/common/util/modal-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe('ModalUtil', () => {
	test('show will dispatch the correct event', () => {
		ModalUtil.show({ example: 'component' })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: { example: 'component' },
				hideViewer: false
			}
		})

		ModalUtil.show({ example: 'component' }, true)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: { example: 'component' },
				hideViewer: true
			}
		})
	})

	test('hide will dispatch the correct event', () => {
		ModalUtil.hide()

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:hide')
	})

	test('getCurrentModal returns the current modal at the top of the display stack', () => {
		expect(
			ModalUtil.getCurrentModal({
				modals: [{ first: 'modal' }, { second: 'modal' }]
			})
		).toEqual({ first: 'modal' })
	})

	test('getCurrentModal returns null with no modals', () => {
		expect(
			ModalUtil.getCurrentModal({
				modals: []
			})
		).toEqual(null)
	})
})
