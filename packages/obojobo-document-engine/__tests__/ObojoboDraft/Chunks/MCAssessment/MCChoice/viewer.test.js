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

jest.mock('../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer-component', () => ({}))
jest.mock('../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/adapter', () => ({}))

const Common = require('../../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import MCChoice from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer'
import ViewerComponent from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer-component'

describe('ObojoboDraft.Chunks.MCAssessment.MCChoice registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.MCAssessment.MCChoice')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
