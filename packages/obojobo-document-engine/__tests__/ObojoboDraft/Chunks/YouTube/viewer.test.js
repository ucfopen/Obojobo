jest.mock('../../../../src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Chunks/YouTube/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/YouTube/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/YouTube/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/YouTube/viewer-component'

describe('ObojoboDraft.Chunks.YouTube registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Registry.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.YouTube')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
	})
})
