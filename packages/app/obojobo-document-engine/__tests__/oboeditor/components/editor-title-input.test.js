import React from 'react'
import renderer from 'react-test-renderer'

import EditorTitleInput from 'src/scripts/oboeditor/components/editor-title-input'

describe('EditorTitleInput', () => {
	test('PageEditor component', () => {
		const component = renderer.create(
			<EditorTitleInput title="mock-title" onChange={jest.fn()} renameModule={jest.fn()} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('PageEditor calls onChange with the new value', () => {
		const onChange = jest.fn()
		const component = renderer.create(
			<EditorTitleInput title="mock-title" onChange={onChange} renameModule={jest.fn()} />
		)
		const inputEl = component.root.findByType('input')

		inputEl.props.onChange({ target: { value: 'mock-new-title' } })

		expect(onChange).toHaveBeenCalledWith('mock-new-title')
	})

	test('PageEditor calls renameModule when blurred', () => {
		const renameModule = jest.fn()
		const component = renderer.create(
			<EditorTitleInput title="mock-title" renameModule={renameModule} onChange={jest.fn()} />
		)
		const inputEl = component.root.findByType('input')

		inputEl.props.onBlur()

		expect(renameModule).toHaveBeenCalledWith('mock-title')
	})

	test('PageEditor calls blur when enter is pressed', () => {
		const blur = jest.fn()
		const component = renderer.create(
			<EditorTitleInput title="mock-title" renameModule={jest.fn()} onChange={jest.fn()} />
		)
		const inputEl = component.root.findByType('input')

		inputEl.props.onKeyDown({ key: 'NotEnter', target: { blur } })

		expect(blur).not.toHaveBeenCalled()

		inputEl.props.onKeyDown({ key: 'Enter', target: { blur } })

		expect(blur).toHaveBeenCalled()
	})
})
