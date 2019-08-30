import './code-editor.scss'
// Allows codemirror to work properly
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/xml-fold.js'
import CodeMirror from 'react-codemirror'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import FileToolbar from './toolbars/file-toolbar'

const { ModalUtil } = Common.util

class CodeEditor extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			code: this.props.initialCode
		}

		this.onChange = this.onChange.bind(this)
		this.saveCode = this.saveCode.bind(this)
	}

	onChange(code) {
		this.setState({ code })
	}

	saveCode() {
		// Update the title in the File Toolbar
		let label = EditorUtil.getTitleFromString(this.state.code, this.props.mode)
		if (!label || !/[^\s]/.test(label)) label = '(Unnamed Module)'
		EditorUtil.renamePage(this.props.model.id, label)

		return APIUtil.postDraft(
			this.props.draftId, 
			this.state.code, 
			this.props.mode === 'xml' ? 'text/plain' : 'application/json')
	}

	render() {
		const options = {
			lineNumbers: true,
			mode: this.props.mode === 'xml' ? 'text/xml' : 'text/json',
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
			<div className={'component editor--code-editor'}>
				<div className="draft-toolbars">
					<div className="draft-title">{this.props.model.title}</div>
					<FileToolbar
						model={this.props.model}
						draftId={this.props.draftId}
						onSave={this.saveCode}
					/>
				</div>
				<CodeMirror options={options} value={this.state.code} onChange={this.onChange} />
			</div>
		)
	}
}

export default CodeEditor
