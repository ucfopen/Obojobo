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

jest.mock('../../../../ObojoboDraft/Chunks/Break/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Break/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/Break/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Break/viewer-component'

describe('ObojoboDraft.Chunks.Break registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Break')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
