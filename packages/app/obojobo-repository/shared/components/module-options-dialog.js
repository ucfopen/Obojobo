require('./module-permissions-dialog.scss')

const React = require('react')
const ModuleIamge = require('./module-image')
const Button = require('./button')
const ButtonLink = require('./button-link')
const { urlForEditor, downloadDocument } = require('../repository-utils')

const deleteModule = (title, draftId, deleteFn) => {
	var response = confirm(`Delete "${title}" id: ${draftId} ?`)
	if(!response) return;
	deleteFn(draftId)
}

const ModuleOptionsDialog = props => (
	<div className="module-permissions-dialog" >
		<div className="top-bar">
			<ModuleIamge id={props.draftId} />
			<div className="module-title">{props.title}</div>
			<Button className="close-button" onClick={props.onClose}>X</Button>
		</div>
		<h1 className="title">Module Options</h1>
		<div className="sub-title">Preview, share, download and more...</div>
		<div className="button-things">
				<ButtonLink url={`/preview/${props.draftId}`} target="_blank" >Preview</ButtonLink>
				<div className="label">Try out this module.</div>

				<ButtonLink url={urlForEditor(props.editor, props.draftId)} target="_blank">Edit</ButtonLink>
				<div className="label">Write, edit, and update content.</div>

				<Button className="new-button" onClick={() => {props.showModulePermissions(props)}}>Share</Button>
				<div className="label">Add or Remove Collaborators.</div>

				<Button className="new-button" onClick={() => {downloadDocument(props.draftId, props.editor === 'visual' ? 'json' : 'xml')}}>Download</Button>
				<div className="label">Grab a copy for yourself.</div>

				<Button className="new-button" onClick={() => {deleteModule(props.title, props.draftId, props.deleteModule)}}>Delete</Button>
				<div className="label">Say goodbye.</div>

		</div>
		<Button className="done-button secondary-button" onClick={props.onClose}>Close</Button>
	</div>
)

module.exports = ModuleOptionsDialog
