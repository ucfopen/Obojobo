require('./module-permissions-dialog.scss')

const React = require('react')
const ModuleIamge = require('./module-image')
const ReactModal = require('react-modal')
const Button = require('./button')
const PeopleSearchDialog = require('./people-search-dialog-hoc')
const PoepleListItem = require('./people-list-item')

class ModulePermissionsDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {peoplePickerOpen: false}
		this.openPeoplePicker = this.openPeoplePicker.bind(this)
		this.closePeoplePicker = this.closePeoplePicker.bind(this)
		this.addPerson = this.addPerson.bind(this)
		this.removePerson = this.removePerson.bind(this)
	}

	componentDidMount(){
		this.props.loadUsersForModule(this.props.draftId)
	}

	openPeoplePicker(){
		this.setState({peoplePickerOpen: true})
	}

	closePeoplePicker(){
		this.setState({peoplePickerOpen: false})
	}

	addPerson(person){
		this.props.addUserToModule(this.props.draftId, person.id)
		this.closePeoplePicker()
	}

	removePerson(userId){
		if(userId === this.props.currentUserId){
			const response = confirm('Remove yourself from this module?')
			if(!response) return
		}
		this.props.deleteModulePermissions(this.props.draftId, userId)
	}

	renderModal(){
		if(this.state.peoplePickerOpen){
			return <ReactModal
				isOpen={true}
				contentLabel="Module Access"
				className="repository--modal"
				overlayClassName="repository--modal-overlay"
				>
					<PeopleSearchDialog
						onClose={this.closePeoplePicker}
						onSelectPerson={this.addPerson}
						currentUserId={this.props.currentUserId}
					/>
				</ReactModal>
		}
		return null
	}

	render(){
		return (
			<div className="module-permissions-dialog" >
				<div className="top-bar">
					<ModuleIamge id={this.props.draftId} />
					<div className="module-title">{this.props.title}</div>
					<Button className="close-button" onClick={this.props.onClose}>X</Button>
				</div>
				<h1 className="title">Module Access</h1>
				<div className="sub-title">Poeple who can edit this module</div>
				<Button className="new-button" onClick={this.openPeoplePicker}>Add People</Button>
				<div className="access-list-wrapper">
					<ul className="access-list">
						{ this.props.draftPermissions[this.props.draftId] ?
							this.props.draftPermissions[this.props.draftId].items.map(p =>
								<PoepleListItem
									key={p.id}
									isMe={p.id === this.props.currentUserId}
									{...p}
								>
									<Button className="close-button" onClick={() => {this.removePerson(p.id)}}>X</Button>
								</PoepleListItem>
							)
							: null
						}
					</ul>
				</div>
				{this.renderModal()}
				<Button className="done-button secondary-button" onClick={this.props.onClose}>Done</Button>
			</div>
		)
	}
}

module.exports = ModulePermissionsDialog
