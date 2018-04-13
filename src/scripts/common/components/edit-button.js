import './edit-button.scss'

import getBackgroundImage from '../../common/util/get-background-image'
import editButton from 'svg-url-loader?noquotes!./edit-button/assets/edit.svg'

const EditButton = props => (
	<div className="obojobo-draft--components--edit-button">
		<button
			onClick={props.onClick}
			style={{ backgroundImage: getBackgroundImage(editButton) }}
			tabIndex={props.shouldPreventTab ? '-1' : 1}
			disabled={props.shouldPreventTab}
		>
			Edit
		</button>
	</div>
)

EditButton.defaultProps = { indent: 0 }

export default EditButton
