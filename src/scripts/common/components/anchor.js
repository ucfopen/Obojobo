import { EMPTY_CHAR } from '../../common/text/text-constants'

// @TODO: check to see if this needs a ref
// if not - convert to a stateless functional component
export default class Anchor extends React.Component {
	render() {
		return (
			<span
				{...this.props}
				className="anchor"
				ref="anchorElement"
				contentEditable={true}
				tabIndex={this.props.shouldPreventTab ? '-1' : ''}
				suppressContentEditableWarning={true}
				data-group-index={`anchor:${this.props.name}`}
			>
				{EMPTY_CHAR}
			</span>
		)
	}
}
