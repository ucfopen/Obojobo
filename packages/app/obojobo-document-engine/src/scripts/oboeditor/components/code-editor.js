import React from 'react'

import './code-editor.scss'
// Allows codemirror to work properly
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/xml-fold.js'
import { Controlled as CodeMirror } from 'react-codemirror2'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import FileToolbar from './toolbars/file-toolbar'
import hotKeyPlugin from '../plugins/hot-key-plugin'
import Common from '../../common'

const Dispatcher = Common.flux.Dispatcher
const XML_MODE = 'xml'
const JSON_MODE = 'json'

const domParser = new DOMParser()
const serial = new XMLSerializer()

class CodeEditor extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			draftTitle: EditorUtil.getTitleFromString(this.props.initialCode, props.mode),
			code: this.props.initialCode,
			saved: true,
			editor: null,
			mode: props.mode,
			options: {
				lineNumbers: true,
				mode: this.getCodeMirrorMode(props.mode),
				matchTags: true,
				foldGutter: true,
				lineWrapping: true,
				indentWithTabs: true,
				tabSize: 4,
				indentUnit: 4,
				gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
				theme: 'monokai'
			}
		}

		this.onBeforeChange = this.onBeforeChange.bind(this)
		this.saveCode = this.saveCode.bind(this)
		this.checkIfSaved = this.checkIfSaved.bind(this)
		this.onKeyUp = this.onKeyUp.bind(this)
		this.onKeyPress = this.onKeyPress.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
		this.onRenameModule = this.onRenameModule.bind(this)

		this.keyBinding = hotKeyPlugin(this.saveCode)
		this.setEditor = this.setEditor.bind(this)

	}

	componentDidMount() {
		// Setup unload to prompt user before closing
		window.addEventListener('beforeunload', this.checkIfSaved)
		Dispatcher.on('editor:renameModule', this.onRenameModule)
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.checkIfSaved)
		Dispatcher.off('editor:renameModule', this.onRenameModule)
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

	setJSONTitle(stringJSON, draftTitle) {
		// replace the title in  the json string
		const json = JSON.parse(stringJSON)
		json.content.title = draftTitle
		return JSON.stringify(json, null, 4)
	}

	setXMLTitle(stringXML, draftTitle) {
		const doc = domParser.parseFromString(stringXML, 'application/xml')

		// find the module element
		let els = doc.getElementsByTagName('Module')
		if (els.length === 0) {
			els = doc.getElementsByTagName('ObojoboDraft.Modules.Module')
		}

		// update the title
		if (els.length > 0) {
			els[0].setAttribute('title', draftTitle)
			stringXML = serial.serializeToString(doc)
		}

		return stringXML
	}

	onRenameModule(payload) {
		const draftTitle = payload.value.name
		const setTitleFn = this.props.mode === XML_MODE ?  this.setXMLTitle : this.setJSONTitle
		const code = setTitleFn(this.state.code, draftTitle)

		this.setState({
			draftTitle,
			code,
			saved: false
		})
	}

	// NOTE: returns a promise
	saveCode() {
		return APIUtil.postDraft(
			this.props.draftId,
			this.state.code,
			this.props.mode === XML_MODE ? 'text/plain' : 'application/json'
		)
		.then((saveDraftResult) => {
			// Update the title in the File Toolbar
			const draftTitle = EditorUtil.getTitleFromString(this.state.code, this.props.mode)
			this.setState({ draftTitle, saved: true })
			return saveDraftResult
		})
	}

	// Makes CodeMirror commands match Slate commands
	convertCodeMirrorToEditor(codeMirror) {
		const editor = codeMirror
		editor.moveToRangeOfDocument = () => {
			const lastInfo = editor.lineInfo(editor.lastLine())
			editor.setSelection(
				{ line: editor.firstLine(), ch: 0 },
				{ line: lastInfo.line, ch: lastInfo.text.length }
			)
			return editor
		}
		editor.focus = () => editor
		editor.delete = () => {
			editor.deleteH(1, 'char')
			return editor
		}
		return { current: editor }
	}

	getCodeMirrorMode(mode) {
		switch (mode) {
			case XML_MODE:
				return 'text/xml'
			case JSON_MODE:
				return 'application/json'
		}
	}

	onKeyDown(event) {
		if (!this.state.editor) return
		this.keyBinding.onKeyDown(event, this.state.editor.current, () => null)
	}

	onKeyUp(event) {
		if (!this.state.editor) return
		this.keyBinding.onKeyUp(event, this.state.editor.current, () => null)
	}

	onKeyPress(event) {
		if (!this.state.editor) return
		this.keyBinding.onKeyDown(event, this.state.editor.current, () => null)
	}

	setEditor(editor) {
		return this.setState({ editor: this.convertCodeMirrorToEditor(editor) })
	}

	render() {
		return (
			<div
				className={'component editor--code-editor'}
				onKeyDown={this.onKeyDown}
				onKeyUp={this.onKeyUp}
				onKeyPress={this.onKeyPress}
			>
				<div className="draft-toolbars">
					<div className="draft-title">{this.state.draftTitle}</div>
					{this.state.editor ? (
						<FileToolbar
							editorRef={this.state.editor}
							draftId={this.props.draftId}
							draftTitle={this.state.draftTitle}
							onSave={this.saveCode}
							switchMode={this.props.switchMode}
							saved={this.state.saved}
							mode={this.props.mode}
							insertableItems={this.props.insertableItems}
						/>
					) : null}
				</div>
				<CodeMirror
					options={this.state.options}
					value={this.state.code}
					onBeforeChange={this.onBeforeChange}
					editorDidMount={this.setEditor}
				/>
			</div>
		)
	}
}

export default CodeEditor
