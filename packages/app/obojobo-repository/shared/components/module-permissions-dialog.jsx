require('./module-permissions-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const ReactModal = require('react-modal')
const Button = require('./button')
const PeopleSearchDialog = require('./people-search-dialog-hoc')
const PeopleListItem = require('./people-list-item')
const { FULL, PARTIAL, MINIMAL, levelName } = require('obojobo-express/server/constants')

class ModulePermissionsDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = { peoplePickerOpen: false }
		this.openPeoplePicker = this.openPeoplePicker.bind(this)
		this.closePeoplePicker = this.closePeoplePicker.bind(this)
		this.addPerson = this.addPerson.bind(this)
		this.removePerson = this.removePerson.bind(this)
		this.changeAccessLevel = this.changeAccessLevel.bind(this)
	}

	componentDidMount() {
		this.props.loadUsersForModule(this.props.draftId)
	}

	openPeoplePicker() {
		this.setState({ peoplePickerOpen: true })
	}

	closePeoplePicker() {
		this.setState({ peoplePickerOpen: false })
	}

	addPerson(person) {
		this.props.addUserToModule(this.props.draftId, person.id)
		this.closePeoplePicker()
	}

	removePerson(userId) {
		if (userId === this.props.currentUserId) {
			const response = window.confirm('Remove yourself from this module?') //eslint-disable-line no-alert
			if (!response) return

			this.props.deleteModulePermissions(this.props.draftId, userId)
			this.props.onClose()
		} else {
			this.props.deleteModulePermissions(this.props.draftId, userId)
		}
	}

	changeAccessLevel(userId, targetLevel) {
		this.props.changeAccessLevel(this.props.draftId, userId, targetLevel)
	}

	renderModal() {
		if (this.state.peoplePickerOpen) {
			let draftPermissions = null

			if (
				this.props.draftPermissions[this.props.draftId] !== null &&
				this.props.draftPermissions[this.props.draftId] !== undefined
			) {
				draftPermissions = this.props.draftPermissions[this.props.draftId].items
			}
			return (
				<ReactModal
					isOpen={true}
					contentLabel="Module Access"
					className="repository--modal"
					overlayClassName="repository--modal-overlay"
					onRequestClose={this.closePeoplePicker}
				>
					<PeopleSearchDialog
						onClose={this.closePeoplePicker}
						onSelectPerson={this.addPerson}
						currentUserId={this.props.currentUserId}
						draftPermissions={draftPermissions}
					/>
				</ReactModal>
			)
		}
		return null
	}

	render() {
		let accessListItemsRender = null
		if (this.props.draftPermissions[this.props.draftId]) {
			accessListItemsRender = this.props.draftPermissions[this.props.draftId].items.map(p => (
				<PeopleListItem key={p.id} isMe={p.id === this.props.currentUserId} {...p}>
					<div className="access-level-dropdown">
						<span>Level:</span>
						<select
							onChange={event => this.changeAccessLevel(p.id, event.target.value)}
							disabled={p.id === this.props.currentUserId}
						>
							<option value={levelName[FULL]} selected={p.accessLevel === FULL}>
								Full
							</option>
							<option value={levelName[PARTIAL]} selected={p.accessLevel === PARTIAL}>
								Partial
							</option>
							<option value={levelName[MINIMAL]} selected={p.accessLevel === MINIMAL}>
								Minimal
							</option>
						</select>
					</div>
					<Button
						className="close-button"
						onClick={() => {
							this.removePerson(p.id)
						}}
						disabled={p.id === this.props.currentUserId}
					>
						×
					</Button>
				</PeopleListItem>
			))
		}

		return (
			<div className="module-permissions-dialog">
				<div className="top-bar">
					<ModuleImage id={this.props.draftId} />
					<div className="module-title" title={this.props.title}>
						{this.props.title}
					</div>
					<Button className="close-button" onClick={this.props.onClose}>
						×
					</Button>
				</div>
				<div className="wrapper">
					<h1 className="title">Module Access</h1>
					<div className="sub-title">
						People who can access this module. Access levels are as follows, note that each level
						contains the previous level.
					</div>
					<div className="access-level-descriptions">
						<span>
							<label>Minimal:</label>
							<p>Can preview, view assessment statistics, and copy the module.</p>
						</span>
						<span>
							<label>Partial:</label>
							<p>Can edit the module.</p>
						</span>
						<span>
							<label>Full:</label>
							<p>Can add or change access or delete the module.</p>
						</span>
					</div>
					<Button id="modulePermissionsDialog-addPeopleButton" onClick={this.openPeoplePicker}>
						Add People
					</Button>
				</div>
				<div className="access-list-wrapper">
					<ul className="access-list">{accessListItemsRender}</ul>
				</div>
				<div className="wrapper">
					{this.renderModal()}
					<Button className="done-button secondary-button" onClick={this.props.onClose}>
						Done
					</Button>
				</div>
			</div>
		)
	}
}

module.exports = ModulePermissionsDialog
