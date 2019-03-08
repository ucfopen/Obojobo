import alignMark from '../../../../src/scripts/oboeditor/components/marks/align-mark'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('AlignMark', () => {
	test('AlignMark registers a type and key', () => {
		const keyDown = alignMark({ align: 'right', key: 'r' })

		const mockChange = {
			setNodeByKey: jest.fn()
		}

		keyDown.onKeyDown({}, mockChange, jest.fn())

		expect(mockChange.setNodeByKey).not.toHaveBeenCalled()
	})

	test('AlignMark does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const keyDown = alignMark({ type: 'left', key: 'l' })

		const mockChange = {
			setNodeByKey: jest.fn()
		}

		keyDown.onKeyDown({ key: 'R' }, mockChange, jest.fn())

		expect(mockChange.setNodeByKey).not.toHaveBeenCalled()
	})

	test('AlignMark does toggles mark if CTRL/CMD + key is pressed', () => {
		const keyDown = alignMark({ type: 'center', key: 'e' })

		const mockChange = {
			setNodeByKey: jest.fn(),
			value: {
				blocks: {
					forEach: funct => {
						funct({
							data: { toJSON: () => ({}) },
							type: TEXT_LINE_NODE
						})

						funct({
							data: { toJSON: () => ({ content: {} }) },
							type: 'mockNode'
						})
					}
				}
			}
		}
		const mockEvent = {
			ctrlKey: true,
			key: 'e',
			preventDefault: jest.fn()
		}

		keyDown.onKeyDown(mockEvent, mockChange, jest.fn())

		expect(mockChange.setNodeByKey).toHaveBeenCalled()
	})
})
