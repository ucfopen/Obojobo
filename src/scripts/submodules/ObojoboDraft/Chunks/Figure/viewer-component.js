import './viewer-component.scss';

import Image from './image';

import ObojoboDraft from 'ObojoboDraft'
let { OboComponent } = ObojoboDraft.components;
let { TextGroupEl } = ObojoboDraft.chunk.textChunk;
let { NonEditableChunk } = ObojoboDraft.chunk;

let Figure = React.createClass({

	render() {
		let data = this.props.model.modelState;

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<NonEditableChunk className={`obojobo-draft--chunks--figure viewer ${data.size}`} ref="component">
				<div className="container">
					<figure unselectable="on">
						<Image chunk={this.props.model} />
						{
							data.textGroup.first.text.length > 0
							?
							<figcaption ref="caption">
								<TextGroupEl parentModel={this.props.model} textItem={data.textGroup.first} groupIndex="0" />
							</figcaption>
							:
							null
						}
					</figure>
				</div>
			</NonEditableChunk>
		</OboComponent>;
	}
});


export default Figure;