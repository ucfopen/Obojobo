require('./repository-banner.scss')

const React = require('react')

/*
const renderFacts = facts => {
	if(!facts) return null
	return (
		<div className="repository--banner--facts-wrapper">
			{facts.map((f,i) =>
				<div key={i} className="repository--banner--fact">
					<div className="repository--banner--fact--title">{f.title}</div>
					<div className="repository--banner--fact--value">{f.value}</div>
				</div>
			)}
		</div>
	)
}
*/

const RepositoryFactBanner = (props) =>
	<div
		className={`repository--section-wrapper--full-width repository--section-wrapper--grey ${props.className}`}
		>
		<div className="repository--section-wrapper--full-width-bg"></div>
		<section className="repository--title-banner repository--info-banner">
			{props.children}
			<h1 className="repository--title-banner--title" data-title={props.title}>{props.title}</h1>
			{/*renderFacts(props.facts)*/}
		</section>
	</div>

module.exports = RepositoryFactBanner

