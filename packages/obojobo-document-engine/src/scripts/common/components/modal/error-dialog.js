import './error-dialog.scss'

import SimpleDialog from './simple-dialog'

export default props => (
	<div className="obojobo-draft--components--modal--error-dialog">
		<SimpleDialog ok title={props.title}>
			{props.children}
		</SimpleDialog>
	</div>
)
