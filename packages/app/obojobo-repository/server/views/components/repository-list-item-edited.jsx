const React = require('react')
const Module = require('./module')

const RepositoryListItemEdited = (props) =>
	<div className="repository--item-list--row">
		<Module id='mountains' title='Geological Liquification Mechanics' />

		<div className="repository--item-list--group--item--date">{props.time}</div>
		<div className="repository--item-list--group--item--text">
			<a href={`/users/${props.user.id}`}>{props.user.name}</a> edited <a href={`modules/${props.module.id}`}>{props.module.title}</a>.
		</div>
		<div className="repository--item-list--group--item--text-detail repository--fact">
			There are now <em className="repository--fact--value">{props.pageCount.current}</em> pages and <em className="repository--fact--value">{props.questionCount.current}</em> questions
		</div>
	</div>

module.exports = RepositoryListItemEdited
