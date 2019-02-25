import ActionButton from 'ObojoboDraft/Chunks/ActionButton/editor'
const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('ActionButton editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: BUTTON_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(ActionButton.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			ActionButton.plugins.renderPlaceholder({
				node: {
					object: 'text'
				}
			})
		).toMatchSnapshot()

		expect(
			ActionButton.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: 'mockType'
				}
			})
		).toMatchSnapshot()

		expect(
			ActionButton.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: BUTTON_NODE,
					text: 'Some text'
				}
			})
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			ActionButton.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: BUTTON_NODE,
					text: ''
				}
			})
		).toMatchSnapshot()
	})
})
