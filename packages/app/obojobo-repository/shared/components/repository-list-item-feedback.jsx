const React = require('react')
const Avatar = require('./avatar')

const RepositoryListItemFeedback = (props) =>
	<div className="repository--item-list--row">
		<Avatar id={props.user.id} />
		<div className="repository--item-list--collection--item--date">{props.time}</div>
		<div className="repository--item-list--collection--item--text">
			<a href={`/users/${props.user.id}`}>{props.user.name}</a> left feedback for <a href={`modules/${props.module.id}`}>{props.module.title}</a>
		</div>
		<div className="repository--item-list--collection--item--text-detail repository--quote">
			"{props.text}"
		</div>
	</div>

module.exports = RepositoryListItemFeedback
