require('./module-image.scss')

const React = require('react')

const ModuleImage = props => (
	<div className="repository--module-icon--image">
		<img src={`/library/module-icon/${props.id}`} width="100%" height="100%" />
	</div>
)

module.exports = ModuleImage
