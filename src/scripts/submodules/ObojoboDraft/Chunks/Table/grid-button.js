import './gridbutton.scss';

let MOUSE_OUT_DELAY_MS = 500;
let NUM_ROWS = 6;
let NUM_COLS = 6;
let DEFAULT_NUM_ROWS = 3;
let DEFAULT_NUM_COLS = 2;

let GridButton = React.createClass({
	getInitialState() {
		return {
			open: false,
			desiredRows: DEFAULT_NUM_ROWS,
			desiredCols: DEFAULT_NUM_COLS
		};
	},

	onButtonMouseOver() {
		this.setDimensions(DEFAULT_NUM_ROWS, DEFAULT_NUM_COLS);
		return this.onMouseOver();
	},

	onMouseOver() {
		clearInterval(this.mouseOutTimeoutId);
		return this.setState({ open:true });
	},

	onMouseOut() {
		return this.mouseOutTimeoutId = setTimeout((() => {
			return this.setState(this.getInitialState());
		}), MOUSE_OUT_DELAY_MS);
	},

	onMouseDown() {
		event.preventDefault();
		// event.stopPropagation()

		this.setState(this.getInitialState());
		return this.props.commandHandler(this.props.command, { rows:this.state.desiredRows, cols:this.state.desiredCols });
	},

	setDimensions(rows, cols) {
		return this.setState({
			desiredRows: rows,
			desiredCols: cols
		});
	},

	createRow(rowIndex) {
		let { state } = this;
		let { setDimensions } = this;
		let { onMouseDown } = this;

		let self = this;

		return React.createElement('tr', { key:rowIndex }, __range__(0, NUM_COLS, false).map(colIndex =>
			// console.log 'gridkey', rowIndex + '-' + colIndex
			React.createElement('td', {
				className: ((rowIndex <= (state.desiredRows - 1)) && (colIndex <= (state.desiredCols - 1)) ? 'selected ' : '') + ((rowIndex + 1) + '-' + (colIndex + 1)),
				key: rowIndex + '-' + colIndex,
				onMouseOver: setDimensions.bind(self, rowIndex + 1, colIndex + 1),
				onMouseDown: onMouseDown.bind(self)
			})
		));
	},

	render() {
		let grid, tooltip;
		let { createRow } = this;

		if (this.state.open) {
			let rows = __range__(0, NUM_ROWS, false).map(index => createRow(index));

			grid = <table
						onMouseOver={this.onMouseOver}
						onMouseOut={this.onMouseOut}
						key='table'
					>
						<tbody>{rows}</tbody>
					</table>;

			tooltip = <div className='tooltip' key='tip'>Insert {this.state.desiredRows}×{this.state.desiredCols} table</div>;
		} else {
			grid = null;
			tooltip = null;
		}

		return <div className='grid-button' key='button' onMouseDown={this.onMouseDown.bind(this, DEFAULT_NUM_ROWS, DEFAULT_NUM_COLS)}>
			<a
				onMouseOver={this.onButtonMouseOver}
				onMouseOut={this.onMouseOut}
				alt={this.props.command.label}
				style={{'backgroundImage':`url("${this.props.command.icon}")`}}
			>
				this.props.command.label
			</a>
			<div className="table-container">
				{grid}
				{tooltip}
			</div>
		</div>;
	}
});


export default GridButton;
function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}