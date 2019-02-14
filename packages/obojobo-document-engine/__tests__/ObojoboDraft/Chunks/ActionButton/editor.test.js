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

		expect(ActionButton.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(ActionButton.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
