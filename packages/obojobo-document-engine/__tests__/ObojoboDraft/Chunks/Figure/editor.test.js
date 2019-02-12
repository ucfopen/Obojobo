jest.mock('../../../../src/scripts/oboeditor/util/text-util')

import Figure from '../../../../ObojoboDraft/Chunks/Figure/editor'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

describe('Figure editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: FIGURE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Figure.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Figure.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'text'
				}
			}, null, jest.fn())
		).toMatchSnapshot()

		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: 'mockType'
				}
			}, null, jest.fn())
		).toMatchSnapshot()

		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: FIGURE_NODE,
					text: 'Some text'
				}
			}, null, jest.fn())
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: FIGURE_NODE,
					text: ''
				}
			}, null, jest.fn())
		).toMatchSnapshot()
	})
})
