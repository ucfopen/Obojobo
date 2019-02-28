jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

import Heading from './editor'
import Common from 'obojobo-document-engine/src/scripts/common/index'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'


describe('Heading editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
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

		expect(Heading.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevant', () => {
		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'text'
				}
			})
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: 'mockType'
				}
			})
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: HEADING_NODE,
					text: 'Some text'
				}
			})
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: HEADING_NODE,
					text: '',
					data: { get: () => ({ align: 'left' }) }
				}
			})
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
