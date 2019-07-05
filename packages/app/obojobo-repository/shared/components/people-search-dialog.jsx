require('./people-search-dialog.scss')

const React = require('react')
const Button = require('./button')
const Avatar = require('./avatar')
const Search = require('./search')
const PoepleListItem = require('./people-list-item')

class PeopleSearchDialog extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount(){
		this.props.clearPeopleSearchResults()
	}

	onSelectPerson(user){
		this.props.onSelectPerson(user)
		this.props.onClose()
	}

	renderResults(){
		return (
			<ul className="access-list">
				{this.props.people.map(p =>
					<PoepleListItem
						key={p.id}
						isMe={p.id === this.props.currentUserId}
						{...p}
					>
						<Button onClick={this.onSelectPerson.bind(this, p)} className="select-button">Select</Button>
					</PoepleListItem>
				)}

			</ul>
		)
	}

	render(){
		return (
			<div className="people-search-dialog" >
				<Button className="close-button" onClick={this.props.onClose}>X</Button>
				<h1 className="title">Search for People</h1>
				<Search
					onChange={this.props.onSearchChange}
					focusOnMount={true}
					placeholder="Search for people..."
				/>

				<div className="access-list-wrapper">
					{this.renderResults()}
				</div>
			</div>
		)
	}
}

module.exports = PeopleSearchDialog
