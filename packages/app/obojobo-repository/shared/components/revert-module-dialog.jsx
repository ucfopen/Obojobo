require('./revert-module-dialog.scss')
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
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)

const Revision = props => {
	const date = dayjs(props.createdAt).format('MMMM wo - h:mm A')
	const selectedClass = props.isSelected ? 'is-selected' : ''

	return (
		<div
			className={`revision-history--item ${selectedClass}`}
			onClick={() => {
				// Pass the index so the revision history
				// menu knows which item is currently selected
				props.onClickRevision(props.index)
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

class RevertModuleDialog extends React.Component {
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

		this.revertModule = this.revertModule.bind(this)
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
					id: draft.revisionId,
					username: draft.userFullName,
					selected: this.state.selectedIndex === index,
					versionNumber: drafts.length - index
				}))

			// Set selectedIndex to 0 to make sure the first draft
			// is selected when a draft gets reverted
			this.setState({
				selectedIndex: 0,
				revisions
			})
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

	revertModule() {
		if (this.state.selectedIndex === 0) {
			// Prevent reverting a module that's already
			// the latest version
			return
		}

		const revision = this.state.revisions[this.state.selectedIndex]
		const draftId = this.props.draftId

		// Load the selected revision and save it
		APIUtil.getDraftRevision(draftId, revision.id).then(res => {
			APIUtil.postDraft(draftId, JSON.stringify(res.json)).then(() => {
				this.loadDraftRevisions()
				this.menuRef.current.scrollTop = 0
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
		const date = dayjs(revision.createdAt).format('MMMM wo')

		return (
			<ReactModal
				isOpen={true}
				onRequestClose={this.closeConfirmDialog}
				className="repository--modal revert-confirm-dialog"
				overlayClassName="repository--modal-overlay"
			>
				<h1 className="dialog-title">Revert Document</h1>
				<div className="dialog-content">
					This will revert the document from {date} and save it as the latest version.
					<small>You can always undo this action by reverting another version.</small>
				</div>
				<div className="dialog-controls">
					<Button className="secondary-button" onClick={this.closeConfirmDialog}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							this.closeConfirmDialog()
							this.revertModule()
						}}
					>
						Yes - Revert
					</Button>
				</div>
			</ReactModal>
		)
	}

	renderMenuToggleButton() {
		return (
			<button className={`toggle-button`} onClick={this.toggleMenu}>
				Toggle Navigation Menu
			</button>
		)
	}

	renderRevisionHistoryMenu() {
		return (
			<CSSTransition timeout={200} in={this.state.isMenuOpen}>
				<div className={`revision-history`} ref={this.menuRef}>
					<div className="menu-expanded">
						<div className="revision-history--title">
							<span>Revision history</span>
							{this.renderMenuToggleButton()}
						</div>
						{this.state.revisions.map((revision, index) => (
							<Revision
								key={revision.id}
								isLatestVersion={index === 0}
								createdAt={revision.createdAt}
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

		return (
			<div className="revert-module-dialog">
				{this.renderConfirmDialog()}
				<div className="revert-module-dialog--header">
					<ModuleImage id={this.props.draftId} />
					<div className="title">{this.props.title}</div>
					<Button className="close-button" onClick={this.props.onClose} ariaLabel="Close dialog">
						×
					</Button>
				</div>
				<div className="revert-module-dialog--body">
					{this.renderRevisionHistoryMenu()}
					<div className="editor-preview">
						<div className="editor-preview--header">
							<Button
								className="revert-button"
								onClick={this.openConfirmDialog}
								disabled={isFirstSelected}
							>
								Revert document to this version
							</Button>
							<ButtonLink
								url={`/preview/${this.props.draftId}`}
								target="_blank"
								className={`preview-button ${!isFirstSelected ? 'disabled' : ''}`}
							>
								Preview module
							</ButtonLink>
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

module.exports = RevertModuleDialog
