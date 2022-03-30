require('./button.scss')

const React = require('react')

const ButtonLink = props => {
	if (props.disabled) {
		return (
			<a className={`repository--button ${props.className || ''} disabled`}>{props.children}</a>
		)
	} else {
		return (
			<a
				href={props.url}
				target={props.target}
				download={props.download || null}
				className={`repository--button ${props.className || ''}`}
			>
				{props.children}
			</a>
		)
	}
}

module.exports = ButtonLink
