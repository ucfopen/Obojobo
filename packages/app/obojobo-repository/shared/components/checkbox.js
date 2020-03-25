require('./checkbox.scss')

const React = require('react')

const Checkbox = props => (
	<button
		className={`repository--checkbox is-${props.checked ? '' : 'not-'}checked`}
		aria-label={props.ariaLabel}
	/>
)

module.exports = Checkbox
