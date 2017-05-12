import './viewer-component.scss';

// katex = null #dynamically load
import katex from 'katex';

import ObojoboDraft from 'ObojoboDraft'
let { OboComponent } = ObojoboDraft.components;
let { NonEditableChunk } = ObojoboDraft.chunk;

let getLatexHtml = function(latex) {
	try {
		let html = katex.renderToString(latex, { displayMode:true });
		return {html};
	} catch (e) {
		return {error: e};
	}
};


let MathEquation = React.createClass({
	getInitialState() {
		let katexHtml = getLatexHtml(this.props.model.modelState.latex);
		if (katexHtml.error != null) {
			katexHtml = '';
		} else {
			katexHtml = katexHtml.html;
		}

		return {katexHtml};
	},

	render() {
		if (this.state.katexHtml.length === 0) {
			return null;
		}

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData} className={`obojobo-draft--chunks--math-equation pad align-${this.props.model.modelState.align}`}>
			<NonEditableChunk >
				<div className="katex-container" dangerouslySetInnerHTML={{__html:this.state.katexHtml}} />
			</NonEditableChunk>
		</OboComponent>;
	}
});


export default MathEquation;