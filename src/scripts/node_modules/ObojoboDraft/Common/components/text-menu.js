import './text-menu.scss';

let TextMenu = React.createClass({
	// getInitialState: ->
	// 	selectionRect: @props.selection.rect

	// componentWillReceiveProps: (nextProps) ->
	// 	@setState {
	// 		selectionRect: nextProps.selection.rect
	// 	}

	renderImg(command) {
		if ((command.image == null)) { return <div><span>{command.label}</span><img className="click-blocker" /></div>; }

		return React.createElement('img', { src:command.image, alt:command.label, title:command.label });
	},

	onMouseDown(label, event) {
		console.log(arguments);

		event.preventDefault();
		event.stopPropagation();

		return this.props.commandHandler(label);
	},

	render() {
		if (!this.props.relativeToElement) { return null; }
		if (!this.props.enabled) { return null; }

		let ctrlRect = this.props.relativeToElement.getBoundingClientRect();
		let selRect = this.props.selectionRect;
		let { renderImg } = this;

		if (!selRect || !this.props.commands || (this.props.commands.length === 0)) { return null; }

		return React.createElement('div', { className:'editor--components--text-menu', style: {
			left: ((selRect.left + (selRect.width / 2)) - ctrlRect.left) + 'px',
			top: (selRect.top - ctrlRect.top) + 'px'
			// height: HEIGHT + 'px'
		}},
			this.props.commands.map(((command, index) => {
				return React.createElement('a', {
					onMouseDown: this.onMouseDown.bind(null, command.label),
					key: index
				}, renderImg(command));
			}))
		);
	}
});


export default TextMenu;