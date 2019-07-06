require('./people-search-dialog.scss')

const React = require('react')
const { useEffect } = require('react')
const Button = require('./button')
const Search = require('./search')
const PoepleListItem = require('./people-list-item')

const PeopleSearchDialog = props => {
	useEffect(() => {props.clearPeopleSearchResults()}, [])
	const onSelectPerson = (user) => {
		props.onSelectPerson(user)
		props.onClose()
	}

	return (
		<div className="people-search-dialog" >
			<Button className="close-button" onClick={props.onClose}>X</Button>
			<h1 className="title">Search for People</h1>
			<Search
				onChange={props.onSearchChange}
				focusOnMount={true}
				placeholder="Search for people..."
			/>
			<div className="access-list-wrapper">
				<ul className="access-list">
					{props.people.map(p =>
						<PoepleListItem
							key={p.id}
							isMe={p.id === props.currentUserId}
							{...p}
						>
							<Button className="select-button" onClick={() => onSelectPerson(p)}>
								Select
							</Button>
						</PoepleListItem>
					)}

				</ul>
			</div>
		</div>
	)
}

module.exports = PeopleSearchDialog
