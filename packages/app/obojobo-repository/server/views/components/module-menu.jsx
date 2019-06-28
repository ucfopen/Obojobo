const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')

class Module extends React.Component {
	constructor(props) {
		super(props)
		this.onPreview = this.onPreview.bind(this)
		this.onEdit = this.onEdit.bind(this)
		this.onShare = this.onShare.bind(this)
		this.onDelete = this.onDelete.bind(this)
	}

	onPreview(event){
		window.location = `/preview/${this.props.draftId}`
	}

	onEdit(event){
		if(this.props.editor === 'visual'){
			window.location = `/editor/${this.props.draftId}`
		}
		else{
			window.location = `/editor#id:${this.props.draftId}`
		}
	}

	onShare(event){
		console.log('onShare')
	}

	onDelete(event){
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
			<div className="repository--module-icon--menu">
				<ModuleImage id={this.props.draftId} />
				<div className="repository--module-icon--menu--title">{this.props.title}</div>
				<Button onClick={this.onPreview}>Preview</Button>
				<Button onClick={this.onEdit}>Edit</Button>
				<Button onClick={this.onShare}>Share</Button>
				<Button onClick={this.onDelete} className="delete">Delete</Button>
			</div>
		)
	}
}

module.exports = Module
