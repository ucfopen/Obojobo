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

jest.mock('../../../../ObojoboDraft/Chunks/HTML/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/HTML/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import HTML from '../../../../ObojoboDraft/Chunks/HTML/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/HTML/viewer-component'

describe('ObojoboDraft.Chunks.HTML registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.HTML')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
