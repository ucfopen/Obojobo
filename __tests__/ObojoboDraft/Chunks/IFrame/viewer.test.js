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

jest.mock('../../../../ObojoboDraft/Chunks/IFrame/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/IFrame/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/IFrame/viewer-component'

describe('ObojoboDraft.Chunks.IFrame registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.IFrame')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
