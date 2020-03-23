require('./checkbox.scss')

const React = require('react')

const Checkbox = props => (
	<div className={`repository--checkbox ${props.className || ''}`}>
		<div className="repository--checkbox--wrapper">
			<input
				type="checkbox"
				className="repository--checkbox--input"
				aria-label={props.ariaLabel}
				defaultChecked={props.checked}
			/>
			<div className={`repository--checkbox--indicator is-${props.checked ? '' : 'not-'}checked`} />
		</div>
		{props.children}
	</div>
)

module.exports = Checkbox
