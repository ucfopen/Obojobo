import FocusUtil from 'ObojoboDraft/Common/util/focus-util';

let OboComponent = React.createClass({
	getDefaultProps() {
		return {tag: 'div'};
	},

	componentDidMount() {
		return this.props.model.processTrigger('onMount');
	},

	componentWillUnmount() {
		return this.props.model.processTrigger('onUnmount');
	},

	render() {
		let Component = this.props.model.getComponentClass();
		let Tag = this.props.tag;

		let className = 'component';
		if (this.props.className != null) {
			className += ` ${this.props.className}`;
		}

		let isFocussed = FocusUtil.getFocussedComponent(this.props.moduleData.focusState) === this.props.model;

		return <Tag
			{...this.props}
			className={className}
			id={`obo-${this.props.model.get('id')}`}
			data-obo-component
			data-id={this.props.model.get('id')}
			data-type={this.props.model.get('type')}
			data-focussed={isFocussed}
		>
			{this.props.children}
		</Tag>;
	}
});


export default OboComponent;