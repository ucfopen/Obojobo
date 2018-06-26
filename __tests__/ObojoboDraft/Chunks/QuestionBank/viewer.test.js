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

jest.mock('../../../../ObojoboDraft/Chunks/QuestionBank/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/QuestionBank/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/QuestionBank/viewer-component'

describe('ObojoboDraft.Chunks.QuestionBank registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.QuestionBank')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
