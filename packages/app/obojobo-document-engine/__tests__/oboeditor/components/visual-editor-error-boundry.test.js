import React from 'react'
import renderer from 'react-test-renderer'
import mockConsole from 'jest-mock-console'
import VisualEditorErrorBoundry from 'src/scripts/oboeditor/components/visual-editor-error-boundry'

describe('VisualEditorErrorBoundry', () => {
	let restoreConsole

	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		restoreConsole()
	})

	test('VisualEditorErrorBoundry component', () => {
		const component = renderer.create(
			<VisualEditorErrorBoundry editorRef={{}}>
				<div>Contents...</div>
			</VisualEditorErrorBoundry>
		)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('VisualEditorErrorBoundry calls undo if a child throws an error', () => {
		const BadComponent = () => {
			throw new Error('I am a bad component')
		}

		const editorRef = {
			undo: jest.fn()
		}

		expect(editorRef.undo).toHaveBeenCalledTimes(0)

		renderer.create(
			<VisualEditorErrorBoundry editorRef={editorRef}>
				<BadComponent />
			</VisualEditorErrorBoundry>
		)

		expect(editorRef.undo).toHaveBeenCalledTimes(1)
	})

	test('VisualEditorErrorBoundry still works if editorRef is null', () => {
		const BadComponent = () => {
			throw new Error('I am a bad component')
		}

		const editorRef = null

		renderer.create(
			<VisualEditorErrorBoundry editorRef={editorRef}>
				<BadComponent />
			</VisualEditorErrorBoundry>
		)
	})
})
