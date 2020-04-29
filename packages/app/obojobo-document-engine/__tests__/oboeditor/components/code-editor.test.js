import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import CodeEditor from 'src/scripts/oboeditor/components/code-editor'
import React from 'react'
import APIUtil from 'src/scripts/viewer/util/api-util'
import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
import ModalUtil from 'src/scripts/common/util/modal-util'
import SimpleDialog from 'src/scripts/common/components/modal/simple-dialog'

jest.mock('src/scripts/viewer/util/api-util')
jest.mock('src/scripts/oboeditor/util/editor-util')
jest.mock('src/scripts/common/components/modal/simple-dialog', () =>
	global.mockReactComponent(this, 'SimpleDialog')
)
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
	})

	test('CodeEditor component', () => {
		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
		}
		const component = renderer.create(<CodeEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('CodeEditor component in JSON_MODE', done => {
		const props = {
			initialCode: '',
			mode: JSON_MODE,
			model: { title: 'Mock Title' }
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

	test('checkIfSaved return', () => {
		const eventMap = {}
		window.addEventListener = jest.fn((event, cb) => {
			eventMap[event] = cb
		})
		const props = {
			initialCode: '',
			mode: JSON_MODE,
			model: { title: 'Mock Title' }
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
			mode: JSON_MODE,
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)
		component.instance().onBeforeChange({}, null, 'mock-code')

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "code": "mock-code",
		  "editor": null,
		  "mode": "json",
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
		}
	`)
	})

	test('setTitle for JSON', () => {
		const props = {
			initialCode: '{ "content": {} }',
			mode: JSON_MODE,
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)
		component.instance().setTitle('Mock Title')

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "code": "{
		    \\"content\\": {
		        \\"title\\": \\"Mock Title\\"
		    }
		}",
		  "editor": null,
		  "mode": "json",
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
		  "saved": true,
		}
	`)
	})

	test('setTitle for XML', () => {
		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)
		component.instance().setTitle('Mock Title')
		component.setState({
			code: '<?xml version="1.0" encoding="utf-8"?><Module title="My XML"></Module>'
		})
		component.instance().setTitle('Mock Second Title')
		component.setState({
			code:
				'<?xml version="1.0" encoding="utf-8"?><ObojoboDraft.Modules.Module title="My XML"></ObojoboDraft.Modules.Module>'
		})
		component.instance().setTitle('Mock Third Title')

		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "code": "<mockSerializedToString/>",
		  "editor": null,
		  "mode": "xml",
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
		}
	`)
	})

	test('saveCode calls APIUtil', () => {
		APIUtil.postDraft.mockResolvedValue({
			status: 'ok'
		})

		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)
		EditorUtil.getTitleFromString.mockReturnValueOnce('     ')
		component.instance().saveCode()
		EditorUtil.getTitleFromString.mockReturnValueOnce('Mock Title')
		component.setProps({ mode: JSON_MODE })
		component.instance().saveCode()

		expect(APIUtil.postDraft).toHaveBeenCalledTimes(2)
	})

	test('saveCode() with invalid document', () => {
		expect.hasAssertions()

		APIUtil.postDraft.mockResolvedValue({
			status: 'error',
			value: {
				message: 'mock_message'
			}
		})

		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)

		expect(ModalUtil.show).toHaveBeenCalledTimes(0)
		return component
			.instance()
			.saveCode()
			.then(() => {
				expect(APIUtil.postDraft).toHaveBeenCalledTimes(1)
				expect(ModalUtil.show).toHaveBeenCalledTimes(1)
				expect(ModalUtil.show).toHaveBeenCalledWith(
					<SimpleDialog ok={true} title="Error: mock_message" />
				)
			})
	})

	test('saveCode() handles save errors', () => {
		expect.hasAssertions()

		APIUtil.postDraft.mockRejectedValueOnce('mock-error')

		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)

		expect(ModalUtil.show).toHaveBeenCalledTimes(0)
		return component
			.instance()
			.saveCode()
			.then(() => {
				expect(APIUtil.postDraft).toHaveBeenCalledTimes(1)
				expect(ModalUtil.show).toHaveBeenCalledTimes(1)
				expect(ModalUtil.show).toHaveBeenCalledWith(
					<SimpleDialog ok={true} title="Error: mock-error" />
				)
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
			model: { title: 'Mock Title' }
		}
		const component = mount(<CodeEditor {...props} />)
		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		component.instance().setEditor(editor)

		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 's',
			metaKey: true
		})

		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 'z',
			metaKey: true
		})

		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 'y',
			metaKey: true
		})

		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 's'
		})

		expect(editor.undo).toHaveBeenCalled()
		expect(editor.redo).toHaveBeenCalled()
	})

	test('setEditor changes state', () => {
		const props = {
			initialCode: '',
			mode: XML_MODE,
			model: { title: 'Mock Title' }
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
		  "mode": "xml",
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
		jest.spyOn(location, 'reload').mockReturnValueOnce()

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
