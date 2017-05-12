import './tablemenu.scss';

import ObojoboDraft from 'ObojoboDraft'
let { Assets } = Common;

let icon = Common.util.getBackgroundImage(require('svg-url-loader?noquotes!./assets/table-menu-icon.svg'));

let TableMenu = React.createClass({
	getDefaultProps() {
		return {
			row: null,
			col: null,
			type: null,
			onMenuCommand() {}
		};
	},

	onClick(cmd, event) {
		event.preventDefault();
		event.stopPropagation();

		this.props.onMenuCommand({
			row: this.props.row,
			col: this.props.col,
			command: cmd
		});

		return false;
	},

	render() {
		switch (this.props.type) {
			case 'row': return this.renderRow();
			case 'col': return this.renderCol();
			default: return null;
		}
	},

	renderRow() {
		let styles =
			{backgroundImage: icon};

		return <div className="obojobo-draft--chunks--table--table-menu row" style={styles}>
			<ul>
				<li className="insert-above" onClick={this.onClick.bind(null, 'insertRowAbove')}>Insert 1 row above</li>
				<li className="insert-below" onClick={this.onClick.bind(null, 'insertRowBelow')}>Insert 1 row below</li>
				<li className="delete" onClick={this.onClick.bind(null, 'deleteRow')}>Delete this row</li>
			</ul>
		</div>;
	},

	renderCol() {
		let styles =
			{backgroundImage: icon};

		return <div className="obojobo-draft--chunks--table--table-menu col" style={styles}>
			<ul>
				<li className="insert-left" onClick={this.onClick.bind(null, 'insertColLeft')}>Insert 1 column left</li>
				<li className="insert-right" onClick={this.onClick.bind(null, 'insertColRight')}>Insert 1 column right</li>
				<li className="delete" onClick={this.onClick.bind(null, 'deleteCol')}>Delete this column</li>
			</ul>
		</div>;
	}
});


export default TableMenu;