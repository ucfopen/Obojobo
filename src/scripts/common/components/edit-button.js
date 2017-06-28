import './edit-button.scss'

import getBackgroundImage from '../../common/util/get-background-image'
import editButton from 'svg-url-loader?noquotes!./edit-button/assets/edit.svg'

export default class EditButton extends React.Component {
	static get defaultProps() {
		return { indent: 0 }
	}

	render() {
		let editButtonStyles = { backgroundImage: getBackgroundImage(editButton) }

		return (
			<div className="obojobo-draft--components--edit-button">
				<button
					onClick={this.props.onClick}
					style={editButtonStyles}
					tabIndex={this.props.shouldPreventTab ? '-1' : 1}
					disabled={this.props.shouldPreventTab}
				>
					Edit
				</button>
			</div>
		)
	}
}
