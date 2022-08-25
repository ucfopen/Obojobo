require('./module-options-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const ButtonLink = require('./button-link')
const { urlForEditor } = require('../repository-utils')
const {
	downloadDocument
} = require('obojobo-document-engine/src/scripts/common/util/download-document')

const deleteModule = (
	title,
	draftId,
	deleteFn,
	startLoadingAnimationFn,
	stopLoadingAnimationFn
) => {
	const response = confirm(`Delete "${title}" id: ${draftId} ?`) //eslint-disable-line no-alert, no-undef
	if (!response) return
	startLoadingAnimationFn()
	deleteFn(draftId).then(stopLoadingAnimationFn)
}

const ModuleOptionsDialog = props => (
	<div className="module-options-dialog">
		<div className="top-bar">
			<ModuleImage id={props.draftId} />
			<div className="module-title">{props.title}</div>
			<Button className="close-button" ariaLabel="Close" onClick={props.onClose}>
				×
			</Button>
		</div>
		<div className="wrapper">
			<h1 className="title">Module Options</h1>
			<p>Your Access Level: {props.accessLevel}</p>
			<div className="buttons-with-labels">
				<div className="button-label-group">
					<ButtonLink url={`/preview/${props.draftId}`} target="_blank">
						Preview
					</ButtonLink>
					<div className="label">View with preview controls.</div>
				</div>

				{props.accessLevel !== 'Minimal' && (
					<div className="button-label-group">
						<ButtonLink url={urlForEditor(props.editor, props.draftId)} target="_blank">
							Edit
						</ButtonLink>
						<div className="label">Write, edit, and update.</div>
					</div>
				)}

				{props.accessLevel === 'Full' && (
					<div className="button-label-group">
						<Button
							id="moduleOptionsDialog-shareButton"
							onClick={() => {
								props.showModulePermissions(props)
							}}
							disabled={props.accessLevel !== 'Full'}
						>
							Share
						</Button>
						<div className="label">Add or remove collaborators.</div>
					</div>
				)}

				<div className="button-label-group">
					<Button
						id="moduleOptionsDialog-assessmentScoreData"
						onClick={() => {
							props.showAssessmentScoreData(props)
						}}
					>
						Assessment Stats
					</Button>
					<div className="label">View scores by student.</div>
				</div>

				{props.accessLevel !== 'Minimal' && (
					<div className="button-label-group">
						<Button
							id="moduleOptionsDialog-showVersionHistoryButton"
							onClick={() => props.showVersionHistory(props)}
							disabled={props.accessLevel === 'Minimal'}
						>
							Version History
						</Button>
						<div className="label">View and restore previous versions.</div>
					</div>
				)}

				<div className="button-label-group">
					<Button
						id="moduleOptionsDialog-manageCollectionsButton"
						onClick={() => {
							props.showModuleManageCollections(props)
						}}
					>
						Manage Collections
					</Button>
					<div className="label">Add to or remove from private collections.</div>
				</div>

				{props.accessLevel !== 'Minimal' && (
					<div className="button-label-group">
						<Button
							id="moduleOptionsDialog-downloadJSONButton"
							onClick={() => {
								downloadDocument(props.draftId, 'json')
							}}
							disabled={props.accessLevel === 'Minimal'}
						>
							Download JSON
						</Button>
						<div className="label">Download a copy in JSON format.</div>
					</div>
				)}

				{props.accessLevel !== 'Minimal' && (
					<div className="button-label-group">
						<Button
							id="moduleOptionsDialog-downloadXMLButton"
							onClick={() => {
								downloadDocument(props.draftId, 'xml')
							}}
							disabled={props.accessLevel === 'Minimal'}
						>
							Download XML
						</Button>
						<div className="label">Download a copy in XML format.</div>
					</div>
				)}

				<div className="button-label-group">
					<ButtonLink url={`/library/${props.draftId}`} target="_blank">
						Public Page
					</ButtonLink>
					<div className="label">Visit this modules public page.</div>
				</div>

				{props.accessLevel === 'Full' && (
					<div className="button-label-group">
						<Button
							id="moduleOptionsDialog-deleteButton"
							className="dangerous-button delete-button"
							onClick={() => {
								deleteModule(
									props.title,
									props.draftId,
									props.deleteModule,
									props.startLoadingAnimation,
									props.stopLoadingAnimation
								)
							}}
							disabled={props.accessLevel !== 'Full'}
						>
							Delete
						</Button>
						<div className="label delete-label">Say farewell.</div>
					</div>
				)}
			</div>
			<Button className="done-button secondary-button" onClick={props.onClose}>
				Close
			</Button>
		</div>
	</div>
)

module.exports = ModuleOptionsDialog
