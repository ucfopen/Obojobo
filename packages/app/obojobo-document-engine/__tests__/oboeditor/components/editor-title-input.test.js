import React from 'react'
import renderer, { act } from 'react-test-renderer'

import EditorTitleInput from 'src/scripts/oboeditor/components/editor-title-input'

describe('EditorTitleInput', () => {
	test('PageEditor component', () => {
		let component
		act(() => {
			component = renderer.create(<EditorTitleInput title="mock-title" renameModule={jest.fn()} />)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('PageEditor onChange updates value', () => {
		// setup
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})

		const inputEl = component.root.findByType('input')

		// establish baseline
		expect(inputEl.props.value).toBe('mock-title')

		// execute
		act(() => {
			const mockChangeEvent = { target: { value: 'mock-new-title' } }
			inputEl.props.onChange(mockChangeEvent)
		})

		// verify
		expect(inputEl.props.value).toBe('mock-new-title')
	})

	test('PageEditor onBlur calls renameModule prop', () => {
		// setup
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})

		const inputEl = component.root.findByType('input')

		// establish baseline
		expect(mockRenameModule).not.toHaveBeenCalled()

		// execute
		act(() => {
			const mockChangeEvent = { target: { value: 'mock-new-title' } }
			inputEl.props.onChange(mockChangeEvent)
		})

		expect(mockRenameModule).not.toHaveBeenCalled()

		act(() => {
			inputEl.props.onBlur()
		})

		// verify
		expect(mockRenameModule).toHaveBeenCalledWith('mock-new-title')
	})

	test('PageEditor onBlur doesnt call renameModule when title hasnt changed', () => {
		// setup
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})

		const inputEl = component.root.findByType('input')

		// establish baseline
		expect(mockRenameModule).not.toHaveBeenCalled()

		// execute
		act(() => {
			const mockChangeEvent = { target: { value: 'mock-title' } }
			inputEl.props.onChange(mockChangeEvent)
		})

		expect(mockRenameModule).not.toHaveBeenCalled()

		act(() => {
			inputEl.props.onBlur()
		})

		// verify
		expect(mockRenameModule).not.toHaveBeenCalled()
	})

	test('PageEditor calls blur when enter is pressed', () => {
		const mockBlur = jest.fn()
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})
		const inputEl = component.root.findByType('input')

		act(() => {
			inputEl.props.onKeyDown({ key: 'NotEnter', target: { blur: mockBlur } })
		})

		expect(mockBlur).not.toHaveBeenCalled()

		act(() => {
			inputEl.props.onKeyDown({ key: 'Enter', target: { blur: mockBlur } })
		})

		expect(mockBlur).toHaveBeenCalled()
	})

	test('PageEditor doesnt call renameModule when escape key is pressed', () => {
		const mockBlur = jest.fn()
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})
		const inputEl = component.root.findByType('input')

		act(() => {
			// update the title
			const mockChangeEvent = { target: { value: 'mock-new-title' } }
			inputEl.props.onChange(mockChangeEvent)
		})

		expect(inputEl.props.value).toBe('mock-new-title')
		expect(mockRenameModule).not.toHaveBeenCalled()

		act(() => {
			inputEl.props.onKeyDown({ key: 'Escape', target: { blur: mockBlur } })
		})

		expect(mockRenameModule).not.toHaveBeenCalled()
		expect(inputEl.props.value).toBe('mock-title')
	})

	test('PageEditor pressing ctrl+s calls blur and preventDefault', () => {
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})
		const inputEl = component.root.findByType('input')
		const mockEvent = {
			key: 's',
			ctrlKey: true,
			preventDefault: jest.fn(),
			target: {
				blur: jest.fn()
			}
		}

		act(() => {
			inputEl.props.onKeyDown(mockEvent)
		})

		expect(mockEvent.target.blur).toHaveBeenCalled()
		expect(mockEvent.preventDefault).toHaveBeenCalled()
	})

	test('PageEditor pressing metaKey+s calls blur and preventDefault', () => {
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})
		const inputEl = component.root.findByType('input')
		const mockEvent = {
			key: 's',
			metaKey: true,
			preventDefault: jest.fn(),
			target: {
				blur: jest.fn()
			}
		}

		act(() => {
			inputEl.props.onKeyDown(mockEvent)
		})

		expect(mockEvent.target.blur).toHaveBeenCalled()
		expect(mockEvent.preventDefault).toHaveBeenCalled()
	})

	test('PageEditor pressing s doesnt call blur or preventDefault', () => {
		const mockRenameModule = jest.fn()
		let component
		act(() => {
			component = renderer.create(
				<EditorTitleInput title="mock-title" renameModule={mockRenameModule} />
			)
		})
		const inputEl = component.root.findByType('input')
		const mockEvent = {
			key: 's',
			preventDefault: jest.fn(),
			target: {
				blur: jest.fn()
			}
		}

		act(() => {
			inputEl.props.onKeyDown(mockEvent)
		})

		expect(mockEvent.target.blur).not.toHaveBeenCalled()
		expect(mockEvent.preventDefault).not.toHaveBeenCalled()
	})
})
