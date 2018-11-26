import Heading from '../../../../ObojoboDraft/Chunks/Heading/editor'
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

	test('plugins.renderPlaceholder exits when not relevent', () => {
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
})
