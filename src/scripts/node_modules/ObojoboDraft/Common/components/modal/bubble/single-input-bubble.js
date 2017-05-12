import './single-input-bubble.scss';

import Bubble from './bubble';

export default React.createClass({
	onChange(event) {
		console.log('BubbleChange', event.target.value);
		return this.props.onChange(event.target.value);
	},

	onSubmit(event) {
		event.preventDefault();
		return this.props.onClose();
	},

	onKeyUp(event) {
		console.log(event.keyCode);
		if (event.keyCode === 27) { //ESC
			return this.props.onCancel();
		}
	},

	componentDidMount() {
		return setTimeout((() => {
			return this.refs.input.select();
		})
		);
	},

	render() {
		console.log('BubbleRender', this.props.value);
		return <Bubble>
			<label className="single-input-bubble">
				<form className="interactable" onSubmit={this.onSubmit}>
					<input ref="input" type="text" value={this.props.value} onChange={this.onChange} onKeyUp={this.onKeyUp} />
					<button onClick={this.onSubmit}>Ok</button>
				</form>
				<span className="label">{this.props.label}</span>
			</label>
		</Bubble>;
	}
});