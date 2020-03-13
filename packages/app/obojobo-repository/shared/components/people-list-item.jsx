require('./people-list-item.scss')

const React = require('react')
const Avatar = require('./avatar')

const PeopleListItem = props => (
	<li className="people-list-item">
		<Avatar avatarUrl={props.avatarUrl} />
		<div className="user-info">
			<div className="user-name">
				{`${props.firstName} ${props.lastName}`} {props.isMe ? <i>(me)</i> : null}
			</div>
			<div className="email">{props.email}</div>
		</div>
		{props.children}
	</li>
)

module.exports = PeopleListItem
