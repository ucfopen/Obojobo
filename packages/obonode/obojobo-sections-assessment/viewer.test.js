jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

jest.mock('./viewer-component', () => ({}))
jest.mock('./adapter', () => ({}))
jest.mock('obojobo-document-engine/src/scripts/viewer', () => ({
	util: {
		AssessmentUtil: {
			getAttemptsRemaining: jest.fn()
		}
	}
}))

const Common = require('obojobo-document-engine/src/scripts/common/index')

// include the script we're testing, it registers the model
import './viewer'

import ViewerComponent from './viewer-component'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { AssessmentUtil } = Viewer.util

describe('ObojoboDraft.Sections.Assessment registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Sections.Assessment')
		expect(register[1]).toHaveProperty('type', 'section')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('getNavItem', expect.any(Function))
		expect(register[1]).toHaveProperty('variables', {
			'assessment:attemptsAmount': expect.any(Function),
			'assessment:attemptsTaken': expect.any(Function),
			'assessment:attemptsRemaining': expect.any(Function)
		})
	})

	test('getNavItem returns link without title', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			title: null
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: 'Assessment',
			contentType: 'Assessment Section',
			path: ['assessment'],
			showChildren: false,
			showChildrenOnNavigation: false
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
			contentType: 'Assessment Section',
			path: ['mock-title'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})

	test('getNavItem correctly handles titles that are numbers', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			title: 5
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toEqual({
			type: 'link',
			label: '5',
			contentType: 'Assessment Section',
			path: ['5'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})

	test('assessment:attemptsRemaining returns `null` when there is no assessment', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce(null)
		}

		// retrieve the method from variables
		const funct = register[1].variables['assessment:attemptsRemaining']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model)
		expect(vari).toEqual(null)
	})

	test('assessment:attemptsRemaining returns unlimited with Infinity attempts', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: Infinity
				}
			})
		}

		// retrieve the method from variables
		const funct = register[1].variables['assessment:attemptsRemaining']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model)
		expect(vari).toEqual('unlimited')
	})

	test('assessment:attemptsRemaining calls AssessmentUtil', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: 17
				}
			})
		}
		const viewerProps = {
			assessmentState: 'mockAssessmentState'
		}
		const AssessmentUtil = Viewer.util.AssessmentUtil

		AssessmentUtil.getAttemptsRemaining.mockReturnValueOnce('mockRemaining')

		// retrieve the method from variables
		const funct = register[1].variables['assessment:attemptsRemaining']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model, viewerProps)
		expect(AssessmentUtil.getAttemptsRemaining).toHaveBeenCalledWith('mockAssessmentState', {
			modelState: { attempts: 17 }
		})
		expect(vari).toEqual('mockRemaining')
	})

	test('assessment:attemptsTaken returns `null` when there is no assessment', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce(null)
		}

		AssessmentUtil.getNumberOfAttemptsCompletedForModel = jest.fn()

		// retrieve the method from the variables
		const funct = register[1].variables['assessment:attemptsTaken']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model)
		expect(vari).toEqual(null)
	})

	test('assessment:attemptsTaken calls AssessmentUtil', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce('mockModel')
		}
		const viewerProps = {
			assessmentState: 'mockAssessmentState'
		}
		const AssessmentUtil = Viewer.util.AssessmentUtil

		AssessmentUtil.getNumberOfAttemptsCompletedForModel.mockReturnValueOnce('mockTaken')

		// retrieve the method from the variables
		const funct = register[1].variables['assessment:attemptsTaken']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model, viewerProps)
		expect(AssessmentUtil.getNumberOfAttemptsCompletedForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			'mockModel'
		)
		expect(vari).toEqual('mockTaken')
	})

	test('assessment:attemptsAmount returns `null` when there is no assessment', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce(null)
		}

		// retrieve the method from variables
		const funct = register[1].variables['assessment:attemptsAmount']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model)
		expect(vari).toEqual(null)
	})

	test('assessment:attemptsAmount returns unlimited with Infinity attempts', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: Infinity
				}
			})
		}

		// retrieve the method from variables
		const funct = register[1].variables['assessment:attemptsAmount']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model)
		expect(vari).toEqual('unlimited')
	})

	test('assessment:attemptsAmount returns number of attempts', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		const model = {
			getParentOfType: jest.fn().mockReturnValueOnce({
				modelState: {
					attempts: 17
				}
			})
		}

		// retrieve the method from variables
		const funct = register[1].variables['assessment:attemptsAmount']
		expect(funct).toEqual(expect.any(Function))

		const vari = funct(model)
		expect(vari).toEqual(17)
	})
})
