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

describe('ObojoboDraft.Pages.Page registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Pages.Page')
		expect(register[1]).toHaveProperty('type', 'page')
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('getTextForVariable')
	})

	test('getNavItem returns link with no title', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
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
			contentType: 'Page',
			path: ['page-2'],
			showChildren: false
		})
	})

	test('getNavItem returns link with title', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			title: 'mock Title'
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: 'mock Title',
			contentType: 'Page',
			path: ['mock-title'],
			showChildren: false
		})
	})

	test('getNavItem returns link with numeric title', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			title: 1
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: '1',
			contentType: 'Page',
			path: ['1'],
			showChildren: false
		})
	})

	test('getTextForVariable returns ', () => {
		jest.spyOn(Math, 'random').mockReturnValue(0.5)
		const register = Common.Registry.registerModel.mock.calls[0]
		const getTextForVariable = register[1].getTextForVariable
		const Variables = {getOrSetValue: jest.fn(() => 'mock-result')}
		const model = {get: jest.fn(() => 'model-get')}
		const result = getTextForVariable(model, 'varname', Variables)

		expect(result).toBe('mock-result')
		expect(Variables.getOrSetValue).toHaveBeenCalledWith('model-get', 'varname', expect.any(Function))
		const varCallBack = Variables.getOrSetValue.mock.calls[0][2]
		expect(varCallBack({min: 1, max: 10})).toBe(6)

	})
})
