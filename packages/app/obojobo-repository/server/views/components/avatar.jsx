const React = require('react')

const Avatar = (props) =>
	<div className={`avatar ${props.className}`}>
		<div className="avatar--image">
			<img src={props.avatarUrl} />
		</div>
		{
			props.notice
			? <div className="avatar--notice">{props.notice}</div>
			: null
		}
	</div>

module.exports = Avatar
