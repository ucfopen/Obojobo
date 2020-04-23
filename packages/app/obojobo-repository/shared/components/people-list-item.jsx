require('./people-list-item.scss')

const React = require('react')
const Avatar = require('./avatar')

const PeopleListItem = props => (
	<li className="people-list-item">
		<Avatar avatarUrl={props.avatarUrl} />
		<div className="user-name">
			{`${props.firstName} ${props.lastName}`} {props.isMe ? <i>(me)</i> : null}
		</div>
		{props.children}
	</li>
)

PeopleListItem.defaultProps = {
	firstName: '',
	lastName: '',
	isMe: false
}

module.exports = PeopleListItem
