import FocusUtil from '../../../src/scripts/common/util/focus-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import OboModel from '../../../src/scripts/common/models/obo-model'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe('FocusUtil', () => {
	test('focusComponent will dispatch the correct event', () => {
		FocusUtil.focusComponent('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId'
			}
		})
	})

	test('unfocus will dispatch the correct event', () => {
		FocusUtil.unfocus()

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:unfocus')
	})

	test('getFocussedComponent returns an OboModel of the focussed component id', () => {
		let root = new OboModel({ id: 'rootId', type: 'test' })

		expect(
			FocusUtil.getFocussedComponent({
				focussedId: 'rootId'
			})
		).toBe(root)
	})
})
