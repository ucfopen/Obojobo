import './viewer-component.scss';

import GridTextGroup from './grid-text-group';
import SelectionHandler from './selection-handler';

import ObojoboDraft from 'ObojoboDraft';

let { TextGroupEl } = ObojoboDraft.chunk.textChunk;
let { OboComponent } = ObojoboDraft.components;

let Table = React.createClass({
	render() {
		let header, row;
		let { model } = this.props;
		let data = model.modelState;
		let { numCols } = data.textGroup;

		if (data.header) {
			row = data.textGroup.items.slice(0, numCols).map(((textGroupItem, index) => {
				return <th
					key={index}
					className={`cell row-0 col-${index}`}
					data-table-position={model.get('id') + ',0,' + index}
				>
					<TextGroupEl parentModel={this.props.model} textItem={textGroupItem} groupIndex={index} />
				</th>;
			})
			);

			header = <tr key="header">
				{ row }
			</tr>;
		} else {
			header = null;
		}

		let startIndex = data.header ? 1 : 0;
		let rows = __range__(startIndex, data.textGroup.numRows, false).map((rowNum => {
			row = data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map(((textGroupItem, index) => {
				return <td
					key={index}
					className={`cell row-${rowNum} col-${index}`}
					data-table-position={model.get('id') + ',' + rowNum + ',' + index}
				>
					<TextGroupEl parentModel={this.props.model} textItem={textGroupItem} groupIndex={rowNum * numCols + index} />
				</td>;
			})
			);

			return <tr key={rowNum}>
				{ row }
			</tr>;
		})
		);

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<div className="obojobo-draft--chunks--table viewer pad">
				<div className="container">
					<table
						className="view"
						ref="table"
						key="table"
					>
						<thead key="thead">
							{header}
						</thead>
						<tbody key="tbody">
							{rows}
						</tbody>
					</table>
				</div>
			</div>
		</OboComponent>;
	}
});


export default Table;
function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}