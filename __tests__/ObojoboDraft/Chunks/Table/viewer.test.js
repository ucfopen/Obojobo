jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	}
}))

jest.mock('../../../../ObojoboDraft/Chunks/Table/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Table/adapter', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Table/selection-handler', () => jest.fn())

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import Table from '../../../../ObojoboDraft/Chunks/Table/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Table/viewer-component'

describe('ObojoboDraft.Chunks.Table registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Table')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
	})
})
