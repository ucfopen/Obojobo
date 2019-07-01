require('./module-menu.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const ButtonLink = require('./button-link')
const Button = require('./button')

class ModuleMenu extends React.Component {
	constructor(props) {
		super(props)
		this.onShare = this.onShare.bind(this)
		this.onDelete = this.onDelete.bind(this)
	}

	urlForEditor(editor, draftId){
		if(editor === 'visual'){
			return `/editor/${draftId}`
		}
		return `/editor#id:${draftId}`
	}

	onShare(){
		console.log('onShare')
	}

	onDelete(){
		var response = confirm(`Delete "${this.props.title}" id: ${this.props.draftId} ?`)
		if(!response) return;
		const options = {
			method: 'DELETE',
			credentials: 'include',
			body: '',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}

		fetch(`/api/drafts/${this.props.draftId}`, options)
		.then(resp => {return resp.json()})
		.then(json => {
			if(json.status.toLowerCase() === 'ok') {
				// @TODO: update the store!
				location.reload()
			}
			else {
				alert('Error')
			}
		})
		.catch(function(error) {
			alert('Error: ' + error.toString())
			console.error(error)
		})
	}

	render(){
		return (
			<div className="repository--module-icon--menu-wrapper" >
				<div className={`repository--module-icon--menu ${this.props.className || ''}`}>
					<ButtonLink url={`/library/${this.props.draftId}`} >Overview</ButtonLink>
					<ButtonLink url={`/preview/${this.props.draftId}`} >Preview</ButtonLink>
					<ButtonLink url={this.urlForEditor(this.props.editor, this.props.draftId)} >Edit</ButtonLink>
					<Button onClick={this.onShare} >Share</Button>
					<Button onClick={this.onDelete} className="delete" >Delete</Button>
				</div>
			</div>
		)
	}
}

module.exports = ModuleMenu
