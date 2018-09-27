jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	},
	chunk: {
		focusableChunk: {
			FocusableSelectionHandler: jest.fn()
		}
	}
}))

jest.mock('../../../../ObojoboDraft/Chunks/MathEquation/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/MathEquation/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/MathEquation/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/MathEquation/viewer-component'

describe('ObojoboDraft.Chunks.MathEquation registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.MathEquation')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
