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

jest.mock('../../../../ObojoboDraft/Chunks/Text/viewer-component', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/Text/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Text/viewer-component'

describe('ObojoboDraft.Chunks.Text registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Text')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', expect.any(Function))
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
	})
})
