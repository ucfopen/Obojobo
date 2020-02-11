import ActionButton from './editor-registration'
const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('ActionButton editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: BUTTON_NODE,
				content: {}
			}
		}

		expect(ActionButton.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.decorate exits when not relevent', () => {
		expect(
			ActionButton.plugins.decorate(
				[{ text: 'mock text' }],
				{}
			)
		).toMatchSnapshot()

		expect(
			ActionButton.plugins.decorate(
				[{ children: [{ text: 'mock text' }] }],
				{}
			)
		).toMatchSnapshot()
	})

	test('plugins.decorate renders a placeholder', () => {
		const editor = {
			children: [{ children: [{ text: '' }] }]
		}

		expect(
			ActionButton.plugins.decorate(
				[{ children: [{ text: '' }] }, [0]],
				editor
			)
		).toMatchSnapshot()
	})
})
