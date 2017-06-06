import ModalUtil from '../../../src/scripts/common/util/modal-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return ({
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	})
})


describe('ModalUtil', () => {
	test('show will dispatch the correct event', () => {
		ModalUtil.show({ example:'component' })

		expect(Dispatcher.trigger).toHaveBeenCalledWith(
			'modal:show',
			{
				value: {
					component: { example:'component' }
				}
			}
		)
	})

	test('hide will dispatch the correct event', () => {
		ModalUtil.hide()

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:hide')
	})

	test('getCurrentModal returns the current modal at the top of the display stack', () => {
		ModalUtil.show({ first:'modal' })
		ModalUtil.show({ second:'modal' })

		expect(ModalUtil.getCurrentModal(
			ModalUtil.getState()
		)).toEqual({ second:'modal' })
	})
})