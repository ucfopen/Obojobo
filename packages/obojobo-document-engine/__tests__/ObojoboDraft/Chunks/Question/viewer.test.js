jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	},
	chunk: {
		textChunk: {
			TextGroupSelectionHandler: jest.fn()
		}
	}
}))

jest.mock('../../../../ObojoboDraft/Chunks/Question/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Question/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/Question/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Question/viewer-component'

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

describe('ObojoboDraft.Chunks.Question registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Question')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
		expect(register[1]).toHaveProperty('getNavItem', expect.any(Function))
	})

	test('getNavItem returns link for a question', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		const model = {
			title: 'mockTitle',
			// Mock the OboModel structure
			parent: {
				children: {
					models: [
						{
							get: jest.fn().mockReturnValueOnce(QUESTION_NODE_TYPE)
						},
						{
							get: jest.fn().mockReturnValueOnce('ObojoboDraft.Chunks.MockChild')
						}
					]
				}
			},
			get: jest.fn().mockReturnValueOnce('mockQuestion')
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})

	test('getNavItem returns link for a question in practice mode', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		const model = {
			modelState: {
				mode: 'practice'
			},
			// Mock the OboModel structure
			parent: {
				children: {
					models: [
						{
							get: jest.fn().mockReturnValueOnce(QUESTION_NODE_TYPE)
						},
						{
							get: jest.fn().mockReturnValueOnce('ObojoboDraft.Chunks.MockChild')
						}
					]
				}
			},
			get: jest.fn().mockReturnValueOnce('mockQuestion')
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})

	test('getNavItem returns link for a question in review mode', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		const model = {
			modelState: {
				mode: 'review'
			},
			// Mock the OboModel structure
			parent: {
				children: {
					models: [
						{
							get: jest.fn().mockReturnValueOnce(QUESTION_NODE_TYPE)
						},
						{
							get: jest.fn().mockReturnValueOnce('ObojoboDraft.Chunks.MockChild')
						}
					]
				}
			},
			get: jest.fn().mockReturnValueOnce('mockQuestion')
		}

		const nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})
})
