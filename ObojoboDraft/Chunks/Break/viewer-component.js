import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components
let { NonEditableChunk } = Common.chunk

export default class Break extends React.Component {
	render() {
		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<NonEditableChunk className="obojobo-draft--chunks--break viewer">
					<hr />
				</NonEditableChunk>
			</OboComponent>
		)
	}
}
