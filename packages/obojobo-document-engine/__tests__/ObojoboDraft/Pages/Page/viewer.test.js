jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Pages/Page/viewer-component', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Pages/Page/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Pages/Page/viewer-component'

describe('ObojoboDraft.Pages.Page registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Pages.Page')
		expect(register[1]).toHaveProperty('type', 'page')
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', null)
	})

	test('getNavItem returns link with no title', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		const model = {
			title: null,
			get: () => 'ObojoboDraft.Pages.Page',
			parent: {
				children: {
					models: [
						{
							get: () => 'not a page'
						},
						{
							get: () => 'ObojoboDraft.Pages.Page'
						}
					]
				}
			}
		}
		model.parent.children.models.push(model)

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: 'Page 2',
			path: ['page-2'],
			showChildren: false
		})
	})

	test('getNavItem returns link with title', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		const model = {
			title: 'mock Title'
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: 'mock Title',
			path: ['mock-title'],
			showChildren: false
		})
	})
})
