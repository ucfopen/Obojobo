const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('toggleHangingIndet', () => {
	let mockEditor
	let mockSetNodeByKey

	beforeEach(() => {
		mockSetNodeByKey = jest.fn()
		mockEditor = {
			setNodeByKey: mockSetNodeByKey,
			value: {
				blocks: []
			}
		}
	})

	test('inverses hangingIndent on text line nodes', () => {
		// setup
		const block = {
			key: 'mock-key',
			type: TEXT_LINE_NODE,
			data: {
				toJSON: jest.fn().mockReturnValue({ hangingIndent: false, other: false })
			}
		}

		const block2 = {
			key: 'mock-key',
			type: TEXT_LINE_NODE,
			data: {
				toJSON: jest.fn().mockReturnValue({ hangingIndent: true, other: '1' })
			}
		}

		mockEditor.value.blocks.push(block, block2)

		const toggleHangingIndent = require('./toggle-hanging-indent').default

		// pre-test-verification
		expect(mockEditor.setNodeByKey).not.toHaveBeenCalled()

		// execute
		toggleHangingIndent(mockEditor)

		// verify
		expect(mockEditor.setNodeByKey).toHaveBeenCalledWith('mock-key', {
			data: { hangingIndent: true, other: false }
		})
		expect(mockEditor.setNodeByKey).toHaveBeenCalledWith('mock-key', {
			data: { hangingIndent: false, other: '1' }
		})
	})

	test('inverses hangingIndent on list line nodes', () => {
		// setup
		const block = {
			key: 'mock-key',
			type: LIST_LINE_NODE,
			data: {
				toJSON: jest.fn().mockReturnValue({ hangingIndent: true, other: false })
			}
		}

		const block2 = {
			key: 'mock-key',
			type: LIST_LINE_NODE,
			data: {
				toJSON: jest.fn().mockReturnValue({ hangingIndent: false, other: '1' })
			}
		}

		mockEditor.value.blocks.push(block, block2)

		const toggleHangingIndent = require('./toggle-hanging-indent').default

		// pre-test-verification
		expect(mockEditor.setNodeByKey).not.toHaveBeenCalled()

		// execute
		toggleHangingIndent(mockEditor)

		// verify
		expect(mockEditor.setNodeByKey).toHaveBeenCalledWith('mock-key', {
			data: { hangingIndent: false, other: false }
		})
		expect(mockEditor.setNodeByKey).toHaveBeenCalledWith('mock-key', {
			data: { hangingIndent: true, other: '1' }
		})
	})
})
