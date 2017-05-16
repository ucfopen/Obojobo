import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'
let { OboComponent } = ObojoboDraft.components;

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