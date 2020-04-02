require('./restore-module-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const ButtonLink = require('./button-link')
const { urlForEditor } = require('../repository-utils')
const APIUtil = require('../api-util')
const ReactModal = require('react-modal')
const moment = require('moment')

const Revision = props => {
	const date = moment(props.createdAt).format('MMMM Do - h:mm A')
	const selectedClass = props.isSelected ? 'is-selected' : ''

	return (
		<div
			className={`revision-history--item ${selectedClass}`}
			onClick={() => {
				// Pass the index so the revision history
				// menu knows which item is currently selected
				props.onClickRevision(props.revisionId, props.index)
			}}
		>
			<span className="date">{date}</span>
			<span className="username">{props.username}</span>
			{props.isLatestVersion ? (
				<span className="latest-version">Latest Version</span>
			) : (
				<span className="version">Version {props.versionNumber}</span>
			)}
		</div>
	)
}

class RestoreModuleDialog extends React.Component {
	constructor(props) {
		super(props)

		this.baseUrl = `${urlForEditor(this.props.editor, this.props.draftId)}?read_only=1`

		this.state = {
			isMenuOpen: true,
			isConfirmDialogOpen: false,
			revisions: [],
			editorUrl: this.baseUrl,
			selectedIndex: 0
		}

		this.restoreModule = this.restoreModule.bind(this)
		this.setSelectedRevision = this.setSelectedRevision.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.loadDraftRevisions = this.loadDraftRevisions.bind(this)
		this.openConfirmDialog = this.openConfirmDialog.bind(this)
		this.closeConfirmDialog = this.closeConfirmDialog.bind(this)

		this.menuRef = React.createRef()
	}

	componentDidMount() {
		this.loadDraftRevisions()
	}

	loadDraftRevisions() {
		APIUtil.getAllDraftRevisions(this.props.draftId).then(drafts => {
			const revisions = drafts.filter(draft => draft.json !== null)
				.map((draft, index) => ({
					createdAt: new Date(draft.createdAt),
					id: draft.revisionId,
					username: draft.userFullName,
					selected: this.state.selectedIndex === index,
					versionNumber: drafts.length - index
				}))

			// Set selectedIndex to 0 to make sure the first draft
			// is selected when a draft gets restored
			this.setState({
				revisions,
				selectedIndex: 0
			})
		})
	}

	setSelectedRevision(revisionId, index) {
		if (this.state.selectedIndex === index) {
			// Prevent the iframe from reloading if
			// the same revision was clicked
			return
		}

		this.setState({
			editorUrl: `${this.baseUrl}&revision_id=${revisionId}`,
			selectedIndex: index
		})
	}

	restoreModule() {
		if (this.state.selectedIndex === 0) {
			// Prevent restoring a module that's already
			// the latest version
			return
		}

		const revision = this.state.revisions[this.state.selectedIndex]
		const draftId = this.props.draftId

		// Load the selected revision and save it
		APIUtil.getDraftRevision(draftId, revision.id).then(res => {
			APIUtil.postDraft(draftId, JSON.stringify(res.json)).then(() => {
				this.loadDraftRevisions()
				this.menuRef.current.scroll({
					top: 0,
					behavior: 'smooth'
				})
			})
		})
	}

	toggleMenu() {
		const isMenuOpen = this.state.isMenuOpen

		this.setState({ isMenuOpen: !isMenuOpen })
	}

	openConfirmDialog() {
		this.setState({ isConfirmDialogOpen: true })
	}

	closeConfirmDialog() {
		this.setState({ isConfirmDialogOpen: false })
	}

	renderConfirmDialog() {
		if (!this.state.isConfirmDialogOpen) {
			return null
		}

		const revision = this.state.revisions[this.state.selectedIndex]
		const date = moment(revision.createdAt).format('MMMM Do')

		return (
			<ReactModal
				isOpen={true}
				onRequestClose={this.closeConfirmDialog}
				className="repository--modal restoration-confirm-dialog"
				overlayClassName="repository--modal-overlay"
			>
				<h1 className="dialog-title">Restore Document</h1>
				<div className="dialog-content">
					This will restore the document from {date} and save it as the latest version.
					<small>You can always undo this action by restoring another version.</small>
				</div>
				<div className="dialog-controls">
					<Button className="secondary-button" onClick={this.closeConfirmDialog}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							this.closeConfirmDialog()
							this.restoreModule()
						}}
					>
						Yes - Restore
					</Button>
				</div>
			</ReactModal>
		)
	}

	renderRevisionHistoryMenu() {
		const menuClass = this.state.isMenuOpen ? 'is-open' : 'is-closed'

		return (
			<div className={`revision-history ${menuClass}`} ref={this.menuRef}>
				<span className="revision-history--title">Revision history</span>
				{this.state.revisions.map((revision, index) => (
					<Revision
						key={revision.id}
						isLatestVersion={index === 0}
						createdAt={revision.createdAt}
						username={revision.username}
						onClickRevision={this.setSelectedRevision}
						revisionId={revision.id}
						isSelected={this.state.selectedIndex === index}
						index={index}
						versionNumber={revision.versionNumber}
					/>
				))}
			</div>
		)
	}

	render() {
		const menuClass = this.state.isMenuOpen ? 'is-open' : 'is-closed'

		return (
			<div className="restore-module-dialog">
				{this.renderConfirmDialog()}
				<div className="restore-module-dialog--header">
					<ModuleImage id={this.props.draftId} />
					<div className="title">{this.props.title}</div>
					<Button className="close-button" onClick={this.props.onClose}>
						×
					</Button>
				</div>
				<div className="restore-module-dialog--body">
					{this.renderRevisionHistoryMenu()}
					<div className="editor-preview">
						<div className="editor-preview--header">
							<Button
								className="restore-button"
								onClick={this.openConfirmDialog}
								disabled={this.state.selectedIndex === 0}
							>
								Restore document to this version
							</Button>
							<ButtonLink
								url={`/preview/${this.props.draftId}`}
								target="_blank"
								className="preview-button"
							>
								Preview module
							</ButtonLink>
							<button className={`toggle-button ${menuClass}`} onClick={this.toggleMenu}>
								Toggle Navigation Menu
							</button>
							<span>Editor preview:</span>
							<small>Note: Changes made in this preview editor will not be saved</small>
						</div>
						<iframe src={this.state.editorUrl} frameBorder="0" loading="lazy" />
					</div>
				</div>
			</div>
		)
	}
}

module.exports = RestoreModuleDialog
