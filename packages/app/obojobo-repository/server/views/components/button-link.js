require('./button.scss')

const React = require('react')

const ButtonLink = (props) =>
	<a
		href={props.url}
		className={`repository--button ${props.className || ''}`}
		>
		{props.children}
	</a>

module.exports = ButtonLink
