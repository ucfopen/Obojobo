const React = require('react')
const ModuleImage = require('./module-image')


const Module = props =>
	<div className="repository--module-icon">
		<a href={`/library/${props.draftId}`} >
			<ModuleImage id={props.draftId} />
			{/*
			<div className="repository--module-icon--flag repository--flag-details"></div>
			<div className="repository--module-icon--flag repository--flag-incomplete"></div>
			*/}
			<div className="repository--module-icon--title">{props.title}</div>
		</a>
		{props.children}
	</div>

module.exports = Module
