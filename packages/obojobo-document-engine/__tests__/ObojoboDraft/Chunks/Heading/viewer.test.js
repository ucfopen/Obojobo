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

jest.mock('../../../../ObojoboDraft/Chunks/Heading/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Chunks/Heading/adapter', () => ({}))

const Common = require('../../../../src/scripts/common/index')

// include the script we're testing, it registers the model
import Heading from '../../../../ObojoboDraft/Chunks/Heading/viewer'
import ViewerComponent from '../../../../ObojoboDraft/Chunks/Heading/viewer-component'

describe('ObojoboDraft.Chunks.Heading registration', () => {
	test('registerModel registers expected vars', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		expect(register[0]).toBe('ObojoboDraft.Chunks.Heading')
		expect(register[1]).toHaveProperty('type', 'chunk')
		expect(register[1]).toHaveProperty('adapter', {})
		expect(register[1]).toHaveProperty('componentClass', ViewerComponent)
		expect(register[1]).toHaveProperty('selectionHandler', {})
		expect(register[1]).toHaveProperty('getNavItem', expect.any(Function))
	})

	test('getNavItem returns link for level 1 headings', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			modelState: {
				headingLevel: 1,
				textGroup: {
					first: {
						text: 'mockHeading'
					}
				}
			},
			getIndex: jest.fn().mockReturnValueOnce(1),
			toText: jest.fn().mockReturnValueOnce('mockText')
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})

	test('getNavItem returns nothing for level 1 headings with a zero index', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			modelState: {
				headingLevel: 1
			},
			getIndex: jest.fn().mockReturnValueOnce(0)
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})

	test('getNavItem returns link for level 2 headings', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			modelState: {
				headingLevel: 2,
				textGroup: {
					first: {
						text: 'mockHeading'
					}
				}
			},
			toText: jest.fn().mockReturnValueOnce('mockText')
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})

	test('getNavItem returns nothing for level 3 headings', () => {
		let register = Common.Store.registerModel.mock.calls[0]
		let model = {
			modelState: {
				headingLevel: 3
			}
		}

		let nav = register[1].getNavItem(model)
		expect(nav).toMatchSnapshot()
	})
})
