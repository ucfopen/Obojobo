require('./restore-module-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const ButtonLink = require('./button-link')
const { urlForEditor } = require('../repository-utils')
const APIUtil = require('../api-util')

const Revision = props => {
	const monthName = props.date.toLocaleDateString('default', { month: 'long', day: 'numeric' })
	const time = props.date.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' })
	const selectedClass = props.selected ? 'is-selected' : 'is-not-selected'

	return (
		<div
			className="revision-history--item"
			onClick={() => {
				// Pass the index so the revision history
				// menu knows which item is currently active
				props.onClickRevision(props.index, props.id)
			}}
		>
			<span className={`date ${selectedClass}`}>
				{monthName} - {time}
			</span>
			<span className="username">{props.username}</span>
			{props.isLatestVersion ? <span className="latest-version">Latest Version</span> : null}
		</div>
	)
}

const RevisionHistory = props => (
	<div className={`revision-history ${props.isMenuOpen ? 'is-open' : 'is-closed'}`}>
		<span className="revision-history--title">Revision history</span>
		{props.revisions.map((revision, index) => (
			<Revision
				key={revision.id}
				isLatestVersion={index === 0}
				date={revision.date}
				username={revision.username}
				onClickRevision={props.onClickRevision}
				id={revision.id}
				selected={props.activeIndex === index}
				index={index}
			/>
		))}
	</div>
)

class RestoreModuleDialog extends React.Component {
	constructor(props) {
		super(props)

		this.baseUrl = `${urlForEditor(this.props.editor, this.props.draftId)}?read_only=1`

		this.state = {
			isMenuOpen: true,
			revisions: [],
			editorUrl: this.baseUrl,
			selectedIndex: 0
		}

		this.restoreModule = this.restoreModule.bind(this)
		this.setSelectedRevision = this.setSelectedRevision.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.loadDraftRevisions = this.loadDraftRevisions.bind(this)
	}

	componentDidMount() {
		this.loadDraftRevisions()
	}

	loadDraftRevisions() {
		APIUtil.getAllDraftRevisions(this.props.draftId).then(drafts => {
			const revisions = drafts
				.filter(draft => draft.json !== null)
				.map((draft, index) => ({
					date: new Date(draft.createdAt),
					id: draft.revisionId,
					username: draft.userFullName,
					selected: this.state.selectedIndex === index
				}))

			// Set selectedIndex to 0 to make sure the first draft
			// is selected when a draft gets restored
			this.setState({
				revisions,
				selectedIndex: 0
			})
		})
	}

	setSelectedRevision(index, revisionId) {
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
		// eslint-disable-next-line no-alert
		const response = window.confirm('Restore document to this version?')

		if (!response) return

		const revision = this.state.revisions[this.state.selectedIndex]
		const draftId = this.props.draftId

		// Load the selected revision and save it
		APIUtil.getDraftRevision(draftId, revision.id).then(res => {
			APIUtil.postDraft(draftId, JSON.stringify(res.json)).then(this.loadDraftRevisions)
		})
	}

	toggleMenu() {
		const isMenuOpen = this.state.isMenuOpen

		this.setState({ isMenuOpen: !isMenuOpen })
	}

	render() {
		const { isMenuOpen, revisions } = this.state
		const menuClass = isMenuOpen ? 'is-open' : 'is-not-open'

		return (
			<div className="restore-module-dialog">
				<div className="restore-module-dialog--header">
					<ModuleImage id={this.props.draftId} />
					<div className="title">{this.props.title}</div>
					<Button className="close-button" onClick={this.props.onClose}>
						×
					</Button>
				</div>
				<div className="restore-module-dialog--body">
					<RevisionHistory
						isMenuOpen={isMenuOpen}
						draftId={this.props.draftId}
						revisions={revisions}
						activeIndex={this.state.selectedIndex}
						onClickRevision={this.setSelectedRevision}
					/>
					<div className="editor-preview">
						<div className="editor-preview--header">
							<Button
								className="restore-button"
								onClick={this.restoreModule}
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
