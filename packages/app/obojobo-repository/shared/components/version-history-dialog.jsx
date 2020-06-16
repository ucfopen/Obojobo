require('./version-history-dialog.scss')
const { CSSTransition } = require('react-transition-group')
const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const ButtonLink = require('./button-link')
const { urlForEditor } = require('../repository-utils')
const APIUtil = require('../api-util')
const ReactModal = require('react-modal')
const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const VersionHistoryListItem = require('./version-history-list-item')

dayjs.extend(advancedFormat)

class VersionHistoryDialog extends React.Component {
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
			const revisions = drafts
				.filter(draft => draft.json !== null)
				.map((draft, index) => ({
					createdAt: new Date(draft.createdAt),
					createdAtDisplay: dayjs(draft.createdAt).format('MMMM Do - h:mm A'),
					id: draft.revisionId,
					username: draft.userFullName,
					selected: index === 0,
					versionNumber: drafts.length - index
				}))

			// Set selectedIndex to 0 to make sure the first draft
			// is selected when a draft gets restored
			this.setState(
				{
					selectedIndex: 0,
					revisions
				},
				() => {
					this.menuRef.current.scrollTop = 0
				}
			)
		})
	}

	setSelectedRevision(index) {
		if (this.state.selectedIndex === index) {
			// Prevent the iframe from reloading if
			// the same revision was clicked
			return
		}

		this.setState({
			editorUrl: `${this.baseUrl}&revision_id=${this.state.revisions[index].id}`,
			selectedIndex: index
		})
	}

	restoreModule() {
		this.closeConfirmDialog()
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
			})
		})
	}

	toggleMenu() {
		this.setState({ isMenuOpen: !this.state.isMenuOpen })
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

		return (
			<ReactModal
				isOpen={true}
				onRequestClose={this.closeConfirmDialog}
				className="repository--modal restore-confirm-dialog"
				overlayClassName="repository--modal-overlay"
			>
				<h1 className="dialog-title">Confirm Restore</h1>
				<div className="dialog-content">
					Restore version <b>{revision.versionNumber}</b> from <b>{revision.createdAtDisplay}</b>?
				</div>
				<div className="dialog-controls">
					<Button className="secondary-button" onClick={this.closeConfirmDialog}>
						Cancel
					</Button>
					<Button onClick={this.restoreModule}>Yes - Restore</Button>
				</div>
			</ReactModal>
		)
	}

	renderMenuToggleButton() {
		return (
			<button className="toggle-button" onClick={this.toggleMenu}>
				Toggle Navigation Menu
			</button>
		)
	}

	renderRevisionHistoryMenu() {
		return (
			<CSSTransition timeout={250} in={this.state.isMenuOpen}>
				<div className="version-history-list" ref={this.menuRef}>
					<div className="menu-expanded">
						<div className="version-history-list--title">
							<span>Version History</span>
							{this.renderMenuToggleButton()}
						</div>
						{this.state.revisions.map((revision, index) => (
							<VersionHistoryListItem
								key={revision.id}
								isLatestVersion={index === 0}
								createdAtDisplay={revision.createdAtDisplay}
								username={revision.username}
								onClickRevision={this.setSelectedRevision}
								isSelected={this.state.selectedIndex === index}
								index={index}
								versionNumber={revision.versionNumber}
							/>
						))}
					</div>
					<div className="menu-collapsed">{this.renderMenuToggleButton()}</div>
				</div>
			</CSSTransition>
		)
	}

	render() {
		const isFirstSelected = this.state.selectedIndex === 0
		const isDisabled = !isFirstSelected ? 'disabled' : ''
		const selectedRevision = this.state.revisions[this.state.selectedIndex] || {}
		const currentVerstionTitle = isFirstSelected
			? 'Latest Version'
			: `Version ${selectedRevision.versionNumber} from ${selectedRevision.createdAtDisplay}`

		return (
			<div className="version-history-dialog">
				{this.renderConfirmDialog()}
				<div className="version-history-dialog--header">
					<ModuleImage id={this.props.draftId} />
					<div className="title">{this.props.title}</div>
					<Button className="close-button" onClick={this.props.onClose} ariaLabel="Close dialog">
						×
					</Button>
				</div>
				<div className="version-history-dialog--body">
					{this.renderRevisionHistoryMenu()}
					<div className="editor-preview">
						<div className="editor-preview--header">
							<Button
								className="restore-button"
								onClick={this.openConfirmDialog}
								disabled={isFirstSelected}
							>
								Restore to this version
							</Button>
							<ButtonLink
								url={`/preview/${this.props.draftId}`}
								target="_blank"
								className={`preview-button ${isDisabled}`}
							>
								Preview module
							</ButtonLink>
							<span>Viewing: {currentVerstionTitle}</span>
							<small>Note: Changes made in preview window will not be saved.</small>
						</div>
						<iframe src={this.state.editorUrl} frameBorder="0" loading="lazy" />
					</div>
				</div>
			</div>
		)
	}
}

module.exports = VersionHistoryDialog
