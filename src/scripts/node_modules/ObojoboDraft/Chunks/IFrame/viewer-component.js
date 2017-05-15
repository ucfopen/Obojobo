import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'
let { OboComponent } = ObojoboDraft.components;

let IFrame = React.createClass({
	render() {
		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<div className='obojobo-draft--chunks--iframe viewer'>
				<iframe src={this.props.model.modelState.src} frameBorder="0" allowFullScreen="true" />
			</div>
		</OboComponent>;
	}
});


export default IFrame;