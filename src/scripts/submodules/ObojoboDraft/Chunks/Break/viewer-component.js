import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'

let { OboComponent } = ObojoboDraft.components;
let { NonEditableChunk } = ObojoboDraft.chunk;

let Break = React.createClass({

	render() {
		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<NonEditableChunk className="obojobo-draft--chunks--break viewer">
				<hr />
			</NonEditableChunk>
		</OboComponent>;
	}
});


export default Break;