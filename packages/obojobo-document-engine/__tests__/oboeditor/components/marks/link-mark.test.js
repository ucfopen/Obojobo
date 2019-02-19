import markHotKey from 'src/scripts/oboeditor/components/marks/link-mark'

describe('LinkMark', () => {
	test('LinkMark registers a type and key', () => {
		const keyDown = markHotKey({ type: 'a', render: () => 'a' })

		expect(keyDown.renderMark({ mark: { type: 'a' } })).toMatchSnapshot()
		expect(keyDown.renderMark({ mark: { type: 'fake' } })).toMatchSnapshot()
	})
})
