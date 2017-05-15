import { EMPTY_CHAR } from 'ObojoboDraft/Common/text/text-constants';

export default React.createClass({
	render() {
		return <span
			{...this.props}
			className='anchor'
			ref='anchorElement'
			contentEditable="true"
			tabIndex={this.props.shouldPreventTab ? '-1' : ''}
			suppressContentEditableWarning={true}
			data-group-index={`anchor:${this.props.name}`}
		>
			{EMPTY_CHAR}
		</span>;
	}
});