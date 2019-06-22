const React = require('react')
import ModuleImage from './module-image'

const Module = props =>
	<a className="repository--module-icon" href={`/library/${props.id}`}>
		<div className="repository--module-icon--image">
			<ModuleImage id={props.id} />
		</div>
		<div className="repository--module-icon--flag repository--flag-details"></div>
		<div className="repository--module-icon--flag repository--flag-incomplete"></div>
		<div className="repository--module-icon--title">{props.title}</div>
	</a>

module.exports = Module
