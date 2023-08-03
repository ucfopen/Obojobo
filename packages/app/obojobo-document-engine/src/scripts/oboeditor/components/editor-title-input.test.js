import React from 'react'
import renderer, { act } from 'react-test-renderer'

import EditorTitleInput from './editor-title-input'

describe('EditorTitleInput', () => {
	test('EditorTitleInput component', () => {
		let component
		act(() => {
			component = renderer.create(<EditorTitleInput title="mock-title" renameModule={jest.fn()} />)
		})
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('EditorTitleInput onChange updates value', () => {
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

	test('EditorTitleInput onBlur calls renameModule prop', () => {
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

	test('EditorTitleInput onBlur doesnt call renameModule when title hasnt changed', () => {
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

	test('EditorTitleInput calls blur when enter is pressed', () => {
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

	test('EditorTitleInput doesnt call renameModule when escape key is pressed', () => {
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

	test('EditorTitleInput pressing ctrl+s calls blur and preventDefault', () => {
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

	test('EditorTitleInput pressing metaKey+s calls blur and preventDefault', () => {
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

	test('EditorTitleInput pressing s doesnt call blur or preventDefault', () => {
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

	test('title is defaulted to an empty string if one is not provided', () => {
		let component
		act(() => {
			component = renderer.create(<EditorTitleInput />)
		})

		const inputEl = component.root.findByType('input')
		expect(inputEl.props.value).toBe('')
	})

	test('changing title to an empty string and pressing enter refocuses and creates a warning', () => {
		const mockFocus = jest.fn()
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
			const mockChangeEvent = { target: { value: '' } }
			inputEl.props.onChange(mockChangeEvent)
		})

		expect(component.root.findAllByProps({ className: 'empty-title-warning' }).length).toBe(0)

		act(() => {
			inputEl.props.onBlur({ target: { focus: mockFocus } })
		})

		expect(mockRenameModule).not.toHaveBeenCalled()
		expect(mockFocus).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByProps({ className: 'empty-title-warning' }).length).toBe(1)
	})

	test('empty title warning is created and removed correctly when title is no longer empty', () => {
		const mockFocus = jest.fn()
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
			const mockChangeEvent = { target: { value: '' } }
			inputEl.props.onChange(mockChangeEvent)
		})

		expect(component.root.findAllByProps({ className: 'empty-title-warning' }).length).toBe(0)

		act(() => {
			inputEl.props.onBlur({ target: { focus: mockFocus } })
		})

		expect(mockRenameModule).not.toHaveBeenCalled()
		expect(mockFocus).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByProps({ className: 'empty-title-warning' }).length).toBe(1)

		// reset calls to mockFocus so we can make sure it isn't called again on the next blur
		mockFocus.mockReset()

		act(() => {
			inputEl.props.onChange({ target: { value: 'mock-new-title' } })
		})

		expect(component.root.findAllByProps({ className: 'empty-title-warning' }).length).toBe(0)

		// bonus check - renameModule should be called now that title is not empty
		act(() => {
			inputEl.props.onBlur({ target: { focus: mockFocus } })
		})

		expect(mockRenameModule).toHaveBeenCalledTimes(1)
		expect(mockFocus).not.toHaveBeenCalled()
	})
})
