import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import CodeEditor from 'src/scripts/oboeditor/components/code-editor'
import React from 'react'
import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
import ModalUtil from 'src/scripts/common/util/modal-util'

jest.mock('src/scripts/oboeditor/util/editor-util')
jest.mock('react-codemirror2', () => ({
	Controlled: global.mockReactComponent(this, 'Codemirror')
}))
jest.mock('src/scripts/common/util/modal-util')

jest.mock('src/scripts/oboeditor/components/toolbars/file-toolbar')

const XML_MODE = 'xml'
const JSON_MODE = 'json'

describe('CodeEditor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
		EditorUtil.getTitleFromString.mockReturnValue('Mock Title')
		EditorUtil.setModuleTitleInJSON.mockReturnValue('mock-setModuleTitleInJSON-return-value')
		EditorUtil.setModuleTitleInXML.mockReturnValue('mock-setModuleTitleInXML-return-value')
	})

	test('CodeEditor component', async () => {
		const props = {
			initialCode: '',
			mode: XML_MODE
		}
		const component = renderer.create(<CodeEditor {...props} />)
		component.update() // allow the suspense & react.lazy to process
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('CodeEditor component before loading', () => {
		const props = {
			initialCode: '',
			mode: XML_MODE
		}
		const component = renderer.create(<CodeEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('CodeEditor component in JSON_MODE', done => {
		const props = {
			initialCode: '',
			mode: JSON_MODE
		}
		const component = mount(<CodeEditor {...props} />)
		component.setState({ editor: {} })

		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('changes the Editor title', () => {
		const props = {
			initialCode: '{ "content": {} }',
			mode: JSON_MODE,
			saveDraft: jest.fn().mockResolvedValue(true)
		}

		// render
		const thing = mount(<CodeEditor {...props} />)

		// make sure onChange is registered with the Editor
		thing
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: 'mock new title' }
			})
		thing
			.find('input')
			.at(0)
			.simulate('blur')

		expect(thing.html()).toMatchSnapshot()
	})

	test('can not change the Editor title to blank', () => {
		const props = {
			initialCode: '{ "content": {} }',
			mode: JSON_MODE,
			saveDraft: jest.fn().mockResolvedValue(true)
		}

		// render
		const thing = mount(<CodeEditor {...props} />)

		// make sure onChange is registered with the Editor
		thing
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: '	' }
			})
		thing
			.find('input')
			.at(0)
			.simulate('blur')

		expect(
			thing
				.find('input')
				.at(0)
				.props()['aria-invalid']
		).toBe(true)
		expect(thing.find('.empty-title-warning').length).toBe(1)

		expect(thing.html()).toMatchSnapshot()
	})

	test('checkIfSaved return', () => {
		const eventMap = {}
		window.addEventListener = jest.fn((event, cb) => {
			eventMap[event] = cb
		})
		const props = {
			initialCode: '',
			mode: JSON_MODE
		}
		const component = mount(<CodeEditor {...props} />)

		// eslint-disable-next-line no-undefined
		expect(eventMap.beforeunload({})).toEqual(undefined)

		component.setState({ saved: false })

		expect(eventMap.beforeunload({})).toEqual(true)

		component.unmount()
	})

	test('onBeforeChange sets state', () => {
		const props = {
			initialCode: '',
			mode: JSON_MODE
		}
		const component = mount(<CodeEditor {...props} />)
		component.instance().onBeforeChange({}, null, 'mock-code')

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "code": "mock-code",
		  "editor": null,
		  "options": Object {
		    "foldGutter": true,
		    "gutters": Array [
		      "CodeMirror-linenumbers",
		      "CodeMirror-foldgutter",
		    ],
		    "indentUnit": 4,
		    "indentWithTabs": true,
		    "lineNumbers": true,
		    "lineWrapping": true,
		    "matchTags": true,
		    "mode": "application/json",
		    "tabSize": 4,
		    "theme": "monokai",
		  },
		  "saved": false,
		  "title": "Mock Title",
		}
	`)
	})

	test('saveAndSetNewTitleInCode for JSON', () => {
		expect.hasAssertions()
		const code = '{ "content": { "title": "Initial Title"} }'
		const props = {
			draftId: 'mock-draft-id',
			initialCode: code,
			mode: JSON_MODE,
			saveDraft: jest.fn().mockResolvedValue(true)
		}
		const component = mount(<CodeEditor {...props} />)
		return component
			.instance()
			.saveAndSetNewTitleInCode('New Title')
			.then(() => {
				const state = component.state()
				expect(state).toHaveProperty('code', 'mock-setModuleTitleInJSON-return-value')
				expect(state).toHaveProperty('title', 'New Title')
				expect(props.saveDraft).toHaveBeenCalledWith(
					'mock-draft-id',
					'mock-setModuleTitleInJSON-return-value',
					'json'
				)
			})
	})

	test('saveAndSetNewTitleInCode for XML', () => {
		expect.hasAssertions()
		const code = '<?xml version="1.0" encoding="utf-8"?><Module title="Initial Title"></Module>'
		const props = {
			draftId: 'mock-draft-id',
			initialCode: code,
			mode: XML_MODE,
			saveDraft: jest.fn().mockResolvedValue(true)
		}
		const component = mount(<CodeEditor {...props} />)

		return component
			.instance()
			.saveAndSetNewTitleInCode('New Title')
			.then(() => {
				const state = component.state()
				expect(state).toHaveProperty('code', 'mock-setModuleTitleInXML-return-value')
				expect(state).toHaveProperty('title', 'New Title')
				expect(props.saveDraft).toHaveBeenCalledWith(
					'mock-draft-id',
					'mock-setModuleTitleInXML-return-value',
					'xml'
				)
			})
	})

	test('saveAndGetTitleFromCode calls saveDraft', () => {
		expect.hasAssertions()
		const code = '{ "content": { "title": "Initial Title"} }'
		const props = {
			draftId: 'mock-draft-id',
			initialCode: code,
			mode: JSON_MODE,
			saveDraft: jest.fn().mockResolvedValue(true)
		}
		const component = mount(<CodeEditor {...props} />)

		return component
			.instance()
			.saveAndGetTitleFromCode()
			.then(() => {
				expect(props.saveDraft).toHaveBeenCalledWith('mock-draft-id', code, 'json')
			})
	})

	test('saveCode() handles saveDraft rejecting', () => {
		expect.hasAssertions()

		const props = {
			initialCode: '',
			mode: XML_MODE,
			saveDraft: jest.fn().mockResolvedValue(false)
		}
		const component = mount(<CodeEditor {...props} />)

		expect(ModalUtil.show).toHaveBeenCalledTimes(0)
		return component
			.instance()
			.sendSave()
			.then(() => {
				expect(props.saveDraft).toHaveBeenCalledTimes(1)
				expect(component.state()).toHaveProperty('saved', false)
			})
	})

	test('onKeyDown() calls editor functions', () => {
		const editor = {
			undo: jest.fn(),
			redo: jest.fn()
		}

		const props = {
			initialCode: '',
			mode: XML_MODE,
			saveDraft: jest.fn().mockResolvedValue(true)
		}
		const component = mount(<CodeEditor {...props} />)

		// for coverage
		// onKeyDown detects editor not set and returns
		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		component.instance().setEditor(editor)

		expect(props.saveDraft).not.toHaveBeenCalled()
		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})
		expect(props.saveDraft).toHaveBeenCalled()

		expect(editor.undo).not.toHaveBeenCalled()
		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 'z',
			metaKey: true
		})
		expect(editor.undo).toHaveBeenCalled()

		expect(editor.redo).not.toHaveBeenCalled()
		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 'y',
			metaKey: true
		})
		expect(editor.redo).toHaveBeenCalled()
	})

	test('setEditor changes state', () => {
		const props = {
			initialCode: '',
			mode: XML_MODE
		}
		const component = mount(<CodeEditor {...props} />)
		const basicEditor = {
			lineInfo: jest.fn().mockReturnValue({ text: {} }),
			lastLine: jest.fn(),
			firstLine: jest.fn(),
			setSelection: jest.fn(),
			deleteH: jest.fn()
		}
		component.instance().setEditor(basicEditor)

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "code": "",
		  "editor": Object {
		    "deleteFragment": [Function],
		    "deleteH": [MockFunction],
		    "firstLine": [MockFunction],
		    "focus": [Function],
		    "lastLine": [MockFunction],
		    "lineInfo": [MockFunction],
		    "selectAll": [Function],
		    "setSelection": [MockFunction],
		  },
		  "options": Object {
		    "foldGutter": true,
		    "gutters": Array [
		      "CodeMirror-linenumbers",
		      "CodeMirror-foldgutter",
		    ],
		    "indentUnit": 4,
		    "indentWithTabs": true,
		    "lineNumbers": true,
		    "lineWrapping": true,
		    "matchTags": true,
		    "mode": "text/xml",
		    "tabSize": 4,
		    "theme": "monokai",
		  },
		  "saved": true,
		  "title": "Mock Title",
		}
	`)

		basicEditor.selectAll()
		expect(basicEditor.lineInfo).toHaveBeenCalled()
		expect(basicEditor.setSelection).toHaveBeenCalled()
		basicEditor.focus()
		basicEditor.deleteFragment()
		expect(basicEditor.deleteH).toHaveBeenCalled()
	})

	test('reload disables event listener and calls location.reload', () => {
		jest.spyOn(window, 'removeEventListener').mockReturnValueOnce()
		Object.defineProperty(window, 'location', {
			value: { reload: jest.fn() }
		})

		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
		}
		const component = renderer.create(<CodeEditor {...props} />)

		component.getInstance().reload()
		expect(window.removeEventListener).toHaveBeenCalled()
		expect(location.reload).toHaveBeenCalled()
	})
})
