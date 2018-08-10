jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Chunks/Figure/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Figure/adapter', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Figure/selection-handler', () => jest.fn())

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import '../../../../ObojoboDraft/Chunks/Figure/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Figure/viewer-component'

describe('ObojoboDraft.Chunks.Figure registration', () => {
	test('registerModel registers expected vars', () => {
		const register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Figure')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
