jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Sections/Content/viewer-component', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import Content from '../../../../ObojoboDraft/Sections/Content/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Sections/Content/viewer-component'

describe('ObojoboDraft.Sections.Content registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Sections.Content')
		expect(register[1]).toHaveProperty('getNavItem')
		expect(register[1]).toHaveProperty('type', 'section')
		expect(register[1]).toHaveProperty('default', true)
		expect(register[1]).toHaveProperty('adapter', null)
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', null)
		expect(register[1]).toHaveProperty('generateNav')
	})

	test('getNavItem returns expected object', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			children: {
				models: []
			}
		}
		let navItem = register[1].getNavItem(model)
		expect(navItem).toEqual({
			type: 'hidden',
			showChildren: true
		})
	})

	test('generateNav builds expected object without children', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			children: {
				models: []
			}
		}
		let nav = register[1].generateNav(model)
		expect(nav).toEqual([{ type: 'seperator' }])
	})

	test('generateNav builds expected object with children', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			children: {
				models: [{ title: 'one', get: () => 1 }, { title: 'two', get: () => 2 }]
			}
		}
		let nav = register[1].generateNav(model)
		expect(nav).toEqual([
			{ id: 1, label: 'one', type: 'link' },
			{ id: 2, label: 'two', type: 'link' },
			{ type: 'seperator' }
		])
	})
})
