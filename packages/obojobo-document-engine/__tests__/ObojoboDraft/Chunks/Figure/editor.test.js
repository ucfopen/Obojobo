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

		expect(Figure.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'text'
				}
			})
		).toMatchSnapshot()

		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: 'mockType'
				}
			})
		).toMatchSnapshot()

		expect(
			Figure.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: FIGURE_NODE,
					text: 'Some text'
				}
			})
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
			})
		).toMatchSnapshot()
	})
})
