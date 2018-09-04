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

jest.mock('../../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/viewer-component', () => ({}))

const Common = require('../../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/viewer'
import ViewerComponent from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/viewer-component'

describe('ObojoboDraft.Chunks.MCAssessment.MCAnswer registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.MCAssessment.MCAnswer')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', null)
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
