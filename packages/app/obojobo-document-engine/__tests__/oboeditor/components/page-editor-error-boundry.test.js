import React from 'react'
import renderer from 'react-test-renderer'
import mockConsole from 'jest-mock-console'
import PageEditorErrorBoundry from 'src/scripts/oboeditor/components/page-editor-error-boundry'

describe('PageEditorErrorBoundry', () => {
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

	test('PageEditorErrorBoundry component', () => {
		const component = renderer.create(
			<PageEditorErrorBoundry editorRef={{}}>
				<div>Contents...</div>
			</PageEditorErrorBoundry>
		)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('PageEditorErrorBoundry calls undo if a child throws an error', () => {
		const BadComponent = () => {
			throw new Error('I am a bad component')
		}

		const editorRef = {
			current: {
				undo: jest.fn()
			}
		}

		expect(editorRef.current.undo).toHaveBeenCalledTimes(0)

		renderer.create(
			<PageEditorErrorBoundry editorRef={editorRef}>
				<BadComponent />
			</PageEditorErrorBoundry>
		)

		expect(editorRef.current.undo).toHaveBeenCalledTimes(1)
	})

	test('PageEditorErrorBoundry still works if editorRef is null', () => {
		const BadComponent = () => {
			throw new Error('I am a bad component')
		}

		const editorRef = {}
		const mockEditorRefCurrentGetter = jest.fn()
		Object.defineProperty(editorRef, 'current', {
			get: () => {
				mockEditorRefCurrentGetter()
				return null
			}
		})

		expect(mockEditorRefCurrentGetter).toHaveBeenCalledTimes(0)

		renderer.create(
			<PageEditorErrorBoundry editorRef={editorRef}>
				<BadComponent />
			</PageEditorErrorBoundry>
		)

		expect(mockEditorRefCurrentGetter).toHaveBeenCalledTimes(1)
	})
})
