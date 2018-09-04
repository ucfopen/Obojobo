jest.mock('../../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	},
	chunk: {
		textChunk: {
			TextGroupSelectionHandler: jest.fn()
		}
	}
}))

jest.mock('../../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/viewer-component', () => ({}))

const Common = require('../../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import MCFeedback from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/viewer'
import ViewerComponent from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/viewer-component'

describe('ObojoboDraft.Chunks.MCAssessment.MCFeedback registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.MCAssessment.MCFeedback')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', null)
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
