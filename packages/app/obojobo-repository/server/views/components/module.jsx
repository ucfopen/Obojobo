const React = require('react')
import ModuleImage from './module-image'

const Module = (props) =>
	<div className="repository--module-icon">
		<div className="repository--module-icon--image">
			<ModuleImage id={props.id} />
		</div>
		<div className="repository--module-icon--flag repository--flag-details"></div>
		<div className="repository--module-icon--flag repository--flag-incomplete"></div>
		<div className="repository--module-icon--title">{props.title}</div>
	</div>

module.exports = Module
