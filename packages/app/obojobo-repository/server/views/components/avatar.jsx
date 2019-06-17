const React = require('react')

const buildUrl = (id) => `https://randomuser.me/api/portraits/${id}.jpg`

const Avatar = (props) =>
	<div className={`avatar ${props.className}`}>
		<div className="avatar--image">
			<img src={buildUrl(props.id)}/>
		</div>
		{
			props.notice
			? <div class="avatar--notice">{props.notice}</div>
			: null
		}
	</div>

module.exports = Avatar
