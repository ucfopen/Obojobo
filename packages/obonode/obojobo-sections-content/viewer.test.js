jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

jest.mock('./viewer-component', () => ({}))

const Common = require('obojobo-document-engine/src/scripts/common/index')

// include the script we're testing, it registers the model
import './viewer'
import ViewerComponent from './viewer-component'

describe('ObojoboDraft.Sections.Content registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Sections.Content')
		expect(register[1]).toHaveProperty('getNavItem')
		expect(register[1]).toHaveProperty('type', 'section')
		expect(register[1]).toHaveProperty('default', true)
		expect(register[1]).toHaveProperty('adapter', null)
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
	})

	test('getNavItem returns expected object', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			children: {
				models: []
			}
		}
		const navItem = register[1].getNavItem(model)
		expect(navItem).toEqual({
			type: 'hidden',
			showChildren: true
		})
	})
})
