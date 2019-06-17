const React = require('react')
import Avatar from './avatar'

const RepositoryListItemFeedback = (props) =>
	<div className="repository--item-list--row">
		<Avatar id={props.user.id} />
		<div className="repository--item-list--group--item--date">{props.time}</div>
		<div className="repository--item-list--group--item--text">
			<a href={`/users/${props.user.id}`}>{props.user.name}</a> left feedback for <a href={`modules/${props.module.id}`}>{props.module.title}</a>
		</div>
		<div className="repository--item-list--group--item--text-detail repository--quote">
			"{props.text}"
		</div>
	</div>

module.exports = RepositoryListItemFeedback
