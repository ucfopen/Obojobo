import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components

export default class IFrame extends React.Component {
	render() {
		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<div className="obojobo-draft--chunks--iframe viewer">
					<iframe
						is
						src={this.props.model.modelState.src}
						frameBorder="0"
						allowFullScreen="true"
						allow={this.props.model.modelState.allow}
					/>
				</div>
			</OboComponent>
		)
	}
}
