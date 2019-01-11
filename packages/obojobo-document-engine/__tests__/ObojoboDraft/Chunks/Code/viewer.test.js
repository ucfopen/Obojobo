jest.mock('../../../../src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	},
	chunk: {
		textChunk: {
			TextGroupAdapter: jest.fn()
		}
	}
}))

jest.mock('../../../../ObojoboDraft/Chunks/Code/viewer-component', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/Code/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Code/viewer-component'

describe('ObojoboDraft.Chunks.Code registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Code')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('default', true)
		expect(register[1]).toHaveProperty('adapter', Common.chunk.textChunk.TextGroupAdapter)
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
	})
})
