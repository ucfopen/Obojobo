jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Modules/Module/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Modules/Module/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import Module from '../../../../ObojoboDraft/Modules/Module/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Modules/Module/viewer-component'

describe('ObojoboDraft.Modules.Module registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Modules.Module')
		expect(register[1]).toHaveProperty('type', 'module')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', null)
	})

	test('getNavItem returns heading', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			title: 'mockTitle'
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'heading',
			label: 'mockTitle',
			showChildren: true
		})
	})
})
