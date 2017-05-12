import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'
import Viewer from 'Viewer'

let { OboComponent } = ObojoboDraft.components;
let { OboModel } = ObojoboDraft.models;

let { QuestionUtil } = Viewer.util;

let MCChoice = React.createClass({
	getDefaultProps() {
		return {
			responseType: null,
			revealAll: false,
			questionSubmitted: false
		};
	},

	// getInitialState: ->
	// 	children: @createChildren(this.props.model.children.models)

	// componentWillReceiveProps: (nextProps) ->
	// 	if nextProps.model?
	// 		@setState { children:@createChildren(this.props.model.children.models) }

	// createChildren: (models) ->
	// 	children = []
	// 	hasFeedback = false
	// 	for model in models
	// 		children.push model
	// 		if model.get('type') is 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
	// 			hasFeedback = true

	// 	if not hasFeedback
	// 		if @props.model.modelState.score is 100
	// 			children.push @createFeedbackItem('Correct!')
	// 		else
	// 			children.push @createFeedbackItem('Incorrect')

	// 	children

	createFeedbackItem(message) {
		let feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
		let text = OboModel.create('ObojoboDraft.Chunks.Text');
		// console.log('text', text)
		text.modelState.textGroup.first.text.insertText(0, message);
		// console.log('feedback', feedback)
		feedback.children.add(text);

		return feedback;
	},

	// onChange: (event) ->
	// 	if event.target.checked
	// 		QuestionUtil.recordResponse @props.model.get('id'), true
	// 	else
	// 		QuestionUtil.resetResponse @props.model.get('id')

	// onClick: (event) ->
	// 	# if not @props.isSelected
	// 		# @props.onChange @props.model, true
	// 	# QuestionUtil.recordResponse @props.model.get('id'), true
	// 	@refs.input.checked = true

	getInputType() {
		switch (this.props.responseType) {
			case 'pick-all':
				return 'checkbox';
			default: //'pick-one', 'pick-one-multiple-correct'
				return 'radio';
		}
	},

	render() {
		let isSelected = __guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model), x => x.set) === true;

		return <OboComponent
			model={this.props.model}
			moduleData={this.props.moduleData}
			className={`obojobo-draft--chunks--mc-assessment--mc-choice${isSelected ? ' is-selected' : ' is-not-selected'}${this.props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect'}`}
			data-choice-label={this.props.label}
		>
			<input
				ref="input"
				type={this.getInputType()}
				value={this.props.model.get('id')}
				checked={isSelected}
				name={this.props.model.parent.get('id')}

			/>
			<div className="children">
				{
					this.props.model.children.map(((child, index) => {
						let type = child.get('type');
						let isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer';
						let isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback';

						if(isAnswerItem)
						{
							let Component = child.getComponentClass();
							return <Component key={child.get('id')} model={child} moduleData={this.props.moduleData} />;
						}
					}))
				}
			</div>
		</OboComponent>;
	}
});

export default MCChoice;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}