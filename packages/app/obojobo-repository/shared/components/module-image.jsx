require('./module-image.scss')

const React = require('react')
const clientGlobals = require('../util/client-globals')

const ModuleImage = props => (
	<div className="repository--module-icon--image">
		<img src={`${clientGlobals.staticAssetUrl}/library/module-icon/${props.id}`} width="100%" height="100%" />
	</div>
)

module.exports = ModuleImage
