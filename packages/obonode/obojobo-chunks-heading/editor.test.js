jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

import Heading from './editor'
import Common from 'obojobo-document-engine/src/scripts/common/index'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

describe('Heading editor', () => {
	test('plugins.renderNode renders Heading when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: HEADING_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Heading.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Heading.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'text'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: 'mockType'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: HEADING_NODE,
						text: 'Some text'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: HEADING_NODE,
						text: '',
						data: { get: () => ({ align: 'left' }) }
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('getNavItem returns expected object', () => {
		const headingMock = Common.Registry.registerModel.mock.calls[0][1]

		const model = {
			modelState: {
				headingLevel: 1,
				textGroup: {
					first: {
						text: 'testText'
					}
				}
			},
			getIndex: () => 0,
			showChildren: false,
			toText: () => 'test string'
		}

		expect(headingMock.getNavItem(model)).toBe(null)

		model.modelState.headingLevel = 2
		expect(headingMock.getNavItem(model)).toEqual({
			type: 'sub-link',
			label: 'testText',
			path: ['test-string'],
			showChildren: false
		})

		model.modelState.headingLevel = 3
		expect(headingMock.getNavItem(model)).toBe(null)
	})
})
