jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

jest.mock('./viewer-component', () => ({}))
jest.mock('./adapter', () => ({}))

const Common = require('obojobo-document-engine/src/scripts/common/index')

// include the script we're testing, it registers the model
import './viewer'
import ViewerComponent from './viewer-component'

describe('ObojoboDraft.Modules.Module registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Modules.Module')
		expect(register[1]).toHaveProperty('type', 'module')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
	})

	test('getNavItem returns heading', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			title: 'mockTitle'
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'heading',
			label: 'mockTitle',
			showChildren: true
		})
	})
})
