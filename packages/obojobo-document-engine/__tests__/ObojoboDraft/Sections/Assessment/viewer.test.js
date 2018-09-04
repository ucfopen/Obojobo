jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Sections/Assessment/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Sections/Assessment/adapter', () => ({}))
jest.mock('../../../../src/scripts/viewer', () => ({
	util: {
		AssessmentUtil: {
			getAttemptsRemaining: jest.fn()
		}
	}
}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import Assessment from '../../../../ObojoboDraft/Sections/Assessment/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Sections/Assessment/viewer-component'
import Viewer from '../../../../src/scripts/viewer'

describe('ObojoboDraft.Sections.Assessment registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Sections.Assessment')
		expect(register[1]).toHaveProperty('type', 'section')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', null)
		expect(register[1]).toHaveProperty('getNavItem', expect.any(Function))
		expect(register[1]).toHaveProperty('variables', {
			'assessment:attemptsAmount': expect.any(Function),
			'assessment:attemptsRemaining': expect.any(Function)
		})
	})

	test('getNavItem returns link without title', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			title: null
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: 'Assessment',
			path: ['assessment'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})

	test('getNavItem returns link with title', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			title: 'mock Title'
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: 'mock Title',
			path: ['mock-title'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})

	test('assessment:attemptsRemaining returns unlimited with Infinity attempts', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: Infinity
				}
			})
		}

		// retrieve the method from variables
		let funct = register[1].variables['assessment:attemptsRemaining']
		expect(funct).toEqual(expect.any(Function))

		let vari = funct(model)
		expect(vari).toEqual('unlimited')
	})

	test('assessment:attemptsRemaining calls AssessmentUtil', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: 17
				}
			})
		}
		let viewerProps = {
			assessmentState: 'mockAssessmentState'
		}
		let AssessmentUtil = Viewer.util.AssessmentUtil

		AssessmentUtil.getAttemptsRemaining.mockReturnValueOnce('mockRemaining')

		// retrieve the method from variables
		let funct = register[1].variables['assessment:attemptsRemaining']
		expect(funct).toEqual(expect.any(Function))

		let vari = funct(model, viewerProps)
		expect(AssessmentUtil.getAttemptsRemaining).toHaveBeenCalledWith('mockAssessmentState', {
			modelState: { attempts: 17 }
		})
		expect(vari).toEqual('mockRemaining')
	})

	test('assessment:attemptsAmount returns unlimited with Infinity attempts', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: Infinity
				}
			})
		}

		// retrieve the method from variables
		let funct = register[1].variables['assessment:attemptsAmount']
		expect(funct).toEqual(expect.any(Function))

		let vari = funct(model)
		expect(vari).toEqual('unlimited')
	})

	test('assessment:attemptsAmount returns number of attempts', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: 17
				}
			})
		}

		// retrieve the method from variables
		let funct = register[1].variables['assessment:attemptsAmount']
		expect(funct).toEqual(expect.any(Function))

		let vari = funct(model)
		expect(vari).toEqual(17)
	})
})
