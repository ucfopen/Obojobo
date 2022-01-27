import renderer, { act } from 'react-test-renderer'
import React from 'react'
import { Editor } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import HoveringPreview from 'src/scripts/oboeditor/components/hovering-preview'

jest.mock('slate-react')
jest.mock('slate')

describe('HoveringPreview', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
	})

	test('renders without LaTeX', () => {
		useSlate.mockReturnValue({ selection: 'mock-selection' })
		Editor.leaf.mockReturnValue([{ text: '' }, []])
		let component

		act(() => {
			component = renderer.create(<HoveringPreview pageEditorContainerRef={{}} />)
		})

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders with LaTeX', () => {
		useSlate.mockReturnValue({ selection: 'mock-selection' })
		Editor.leaf.mockReturnValue([{ text: '\theta', _latex: true }, []])
		const containerRef = {
			current: {
				removeAttribute: jest.fn(),
				style: {}
			}
		}
		let component

		act(() => {
			component = renderer.create(<HoveringPreview pageEditorContainerRef={containerRef} />)
		})

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders hides without editor selection', () => {
		useSlate.mockReturnValue({ selection: null })
		Editor.leaf.mockReturnValue([{ text: '\theta', _latex: true }, []])

		const containerRef = {
			removeAttribute: jest.fn(),
			style: {}
		}
		// mock react ref node
		const ref = {
			removeAttribute: jest.fn(),
			style: {},
			offsetHeight: 10,
			offsetWidth: 11
		}

		act(() => {
			renderer.create(<HoveringPreview pageEditorContainerRef={containerRef} />, {
				createNodeMock: () => ref
			})
		})

		expect(ref.style).toEqual({})
	})

	test('renders hides when the editor isnt focused', () => {
		useSlate.mockReturnValue({ selection: 'mock-selection' })
		Editor.leaf.mockReturnValue([{ text: '\theta', _latex: true }, []])

		const containerRef = {
			removeAttribute: jest.fn(),
			style: {}
		}
		// mock react ref node
		const ref = {
			removeAttribute: jest.fn(),
			style: {},
			offsetHeight: 10,
			offsetWidth: 11
		}

		act(() => {
			renderer.create(<HoveringPreview pageEditorContainerRef={containerRef} />, {
				createNodeMock: () => ref
			})
		})

		expect(ref.removeAttribute).toHaveBeenCalledWith('style')
		expect(ref.style).toEqual({})
	})

	test('renders hides when parent node isnt a span', () => {
		useSlate.mockReturnValue({ selection: 'mock-selection' })
		Editor.leaf.mockReturnValue([{ text: '\theta', _latex: true }, []])
		ReactEditor.isFocused.mockReturnValue(true)

		// mock out dom getSelection
		const getBoundingClientRect = () => ({
			top: 1,
			width: 2,
			left: 3
		})
		const domRange = {
			commonAncestorContainer: { parentNode: { tagName: 'DIV', getBoundingClientRect } }
		}
		const selection = { getRangeAt: jest.fn().mockReturnValue(domRange) }
		window.getSelection = jest.fn().mockReturnValue(selection)

		const containerRef = {
			current: {
				getBoundingClientRect
			}
		}
		// mock react ref node
		const ref = {
			removeAttribute: jest.fn(),
			style: {}
		}

		act(() => {
			renderer.create(<HoveringPreview pageEditorContainerRef={containerRef} />, {
				createNodeMock: () => ref
			})
		})

		expect(ref.removeAttribute).toHaveBeenCalledWith('style')
		expect(ref.style).toEqual({})
	})

	test('updates dom style when it should be visible', () => {
		useSlate.mockReturnValue({ selection: 'mock-selection' })
		Editor.leaf.mockReturnValue([{ text: '\theta', _latex: true }, []])
		ReactEditor.isFocused.mockReturnValue(true)

		// mock out dom getSelection
		const getBoundingClientRect = () => ({
			top: 1,
			width: 2,
			left: 3
		})
		const domRange = {
			commonAncestorContainer: { parentNode: { tagName: 'SPAN', getBoundingClientRect } }
		}
		const selection = { getRangeAt: jest.fn().mockReturnValue(domRange) }
		window.getSelection = jest.fn().mockReturnValue(selection)

		const containerRef = {
			current: {
				getBoundingClientRect
			}
		}
		// mock react ref node
		const ref = {
			removeAttribute: jest.fn(),
			style: {},
			offsetHeight: 10,
			offsetWidth: 12
		}

		act(() => {
			renderer.create(<HoveringPreview pageEditorContainerRef={containerRef} />, {
				createNodeMock: () => ref
			})
		})

		expect(ref.style).toEqual({ left: '-5px', display: 'block', top: '-16px' })
	})
})
