require('./button.scss')

const React = require('react')

const Button = props =>
	<button
		onClick={(e) => {e.preventDefault(); props.onClick();}}
		className={`repository--button ${props.className || ''}`}
	>
		{props.children}
	</button>

module.exports = Button
