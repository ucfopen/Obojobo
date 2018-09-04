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

jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/adapter', () => ({}))

jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/viewer', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/viewer', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/MCAssessment/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/MCAssessment/viewer-component'

describe('ObojoboDraft.Chunks.MCAssessment registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.MCAssessment')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
