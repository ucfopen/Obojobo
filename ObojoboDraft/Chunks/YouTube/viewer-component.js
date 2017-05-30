import './viewer-component.scss';

import Common from 'Common'
let { OboComponent } = Common.components;

let YouTube = React.createClass({
	render() {
		let data = this.props.model.modelState;

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<div className='obojobo-draft--chunks--you-tube viewer'>
				<iframe src={`https://www.youtube.com/embed/${data.videoId}`} frameBorder="0" allowFullScreen="true" />
			</div>
		</OboComponent>;
	}
});


export default YouTube;