import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { TextChunk } = Common.chunk

export default class Heading extends React.Component {
	render() {
		let data = this.props.model.modelState

		let inner = React.createElement(
			`h${data.headingLevel}`,
			null,
			<TextGroupEl parentModel={this.props.model} textItem={data.textGroup.first} groupIndex="0" />
		)

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<TextChunk className="obojobo-draft--chunks--heading pad">{inner}</TextChunk>
			</OboComponent>
		)
	}
}
