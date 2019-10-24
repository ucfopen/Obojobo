const React = require('react')
const Module = require('./module')

const RepositoryListItemScores = (props) =>
	<div className="repository--item-list--row">
		<Module id={props.module.id} title={props.module.name} />
		<div className="repository--item-list--collection--item--date">{props.time}</div>
		<div className="repository--item-list--collection--item--text">
			<a href={`modules/${props.module.id}`}>{props.module.title}</a> has {props.count} new scores.
		</div>
		<div className="repository--item-list--collection--item--text-detail repository--fact">
			Average score <em className="repository--fact--good">increased</em> from <em className="repository--fact--value">{props.average.previous}%</em> to <em className="repository--fact--value">{props.average.current}%</em>
		</div>
	</div>

module.exports = RepositoryListItemScores
