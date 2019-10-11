import React from 'react'

import './code-editor.scss'
// Allows codemirror to work properly
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/xml-fold.js'
import { Controlled as CodeMirror } from 'react-codemirror2'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import FileToolbar from './toolbars/file-toolbar'
import hotKeyPlugin from '../plugins/hot-key-plugin'

const XML_MODE = 'xml'
const JSON_MODE = 'json'

const domParser = new DOMParser()
const serial = new XMLSerializer()

class CodeEditor extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			code: this.props.initialCode,
			saved: true
		}

		this.onBeforeChange = this.onBeforeChange.bind(this)
		this.saveCode = this.saveCode.bind(this)
		this.setTitle = this.setTitle.bind(this)
		this.checkIfSaved = this.checkIfSaved.bind(this)
		this.getEditor = this.getEditor.bind(this)

		this.editor = null;

		this.keyBinding = hotKeyPlugin(this.saveCode)
	}

	componentDidMount() {
		// Setup unload to prompt user before closing
		window.addEventListener("beforeunload", this.checkIfSaved)
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.checkIfSaved)
	}

	checkIfSaved(event) {
		if (!this.state.saved) {
			event.returnValue = true
			return true // Returning true will cause browser to ask user to confirm leaving page
		}
		//eslint-disable-next-line
		return undefined // Returning undefined will allow browser to close normally
	}

	onBeforeChange(editor, data, code) {
		this.setState({ code, saved: false })
	}

	setJSONTitle(code, title) {
		const json = JSON.parse(code)
		json.content.title = title
		return { code: JSON.stringify(json, null, 4)}
	}

	setXMLTitle(code, title) {
		const doc = domParser.parseFromString(code, 'application/xml')
		let els = doc.getElementsByTagName('Module')
		if (els.length === 0) {
			els = doc.getElementsByTagName('ObojoboDraft.Modules.Module')
		}
		if (els.length > 0) {
			const el = els[0]
			el.setAttribute('title', title)
		}
		return { code: serial.serializeToString(doc)}
	}

	setTitle(title) {
		return this.setState((state, props) => {
			switch(props.mode) {
				case JSON_MODE:
					return this.setJSONTitle(state.code, title)

				case XML_MODE:
					return this.setXMLTitle(state.code, title)
			}
		})
	}

	saveCode() {
		// Update the title in the File Toolbar
		let label = EditorUtil.getTitleFromString(this.state.code, this.props.mode)
		if (!label || !/[^\s]/.test(label)) label = '(Unnamed Module)'
		EditorUtil.renamePage(this.props.model.id, label)

		this.setState({ saved: true })

		return APIUtil.postDraft(
			this.props.draftId, 
			this.state.code, 
			this.props.mode === 'xml' ? 'text/plain' : 'application/json')
	}

	getEditor() {
		return this.editor
	}

	// Makes CodeMirror commands match Slate commands
	convertCodeMirrorToEditor(codeMirror) {
		const editor = codeMirror
		editor.moveToRangeOfDocument = () => { 
			const lastInfo = editor.lineInfo(editor.lastLine())
			editor.setSelection( 
				{ line: editor.firstLine(), ch: 0 }, 
				{ line: lastInfo.line, ch: lastInfo.text.length})
			return editor
		}
		editor.focus = () => editor
		editor.delete = () => {
			editor.deleteH(1, 'char')
			return editor
		}
		return editor
	}

	render() {
		const options = {
			lineNumbers: true,
			mode: this.props.mode === 'classic' ? 'text/xml' : 'text/json',
			matchTags: true,
			foldGutter: true,
			lineWrapping: true,
			indentWithTabs: true,
			tabSize: 4,
			indentUnit: 4,
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
			theme: 'monokai'
		}

		return (
			<div 
				className={'component editor--code-editor'}
				onKeyDown={event => this.keyBinding.onKeyDown(event, this.getEditor(), () => undefined)}
				onKeyUp={event => this.keyBinding.onKeyUp(event, this.getEditor(), () => undefined)}
				onKeyPress={event => this.keyBinding.onKeyDown(event, this.getEditor(), () => undefined)}>
				<div className="draft-toolbars">
					<div className="draft-title">{this.props.model.title}</div>
					<FileToolbar
						model={this.props.model}
						draftId={this.props.draftId}
						onSave={this.saveCode}
						onRename={this.setTitle}
						switchMode={this.props.switchMode}
						saved={this.state.saved}
						getEditor={this.getEditor}
						mode={this.props.mode}
					/>
				</div>
				<CodeMirror 
					options={options} 
					value={this.state.code} 
					onBeforeChange={this.onBeforeChange} 
					editorDidMount={editor => { this.editor = this.convertCodeMirrorToEditor(editor) }}/>
			</div>
		)
	}
}

export default CodeEditor
