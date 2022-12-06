require('./people-list-item.scss')

const React = require('react')
const Avatar = require('./avatar')

const PeopleListItem = props => {
	return (
		<li className="people-list-item">
			<Avatar avatarUrl={props.avatarUrl} />
			<div className="user-info">
				<div className="user-name">
					{`${props.firstName} ${props.lastName}`} {props.isMe ? <i>(me)</i> : null}
				</div>
				<div className="user-username">{props.username}</div>
			</div>
			{props.children}
		</li>
	)
}

PeopleListItem.defaultProps = {
	firstName: '',
	lastName: '',
	isMe: false
}

module.exports = PeopleListItem
