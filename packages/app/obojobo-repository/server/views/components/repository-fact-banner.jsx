const React = require('react')


const renderFacts = facts => {
	if(!facts) return null
	return (
		<div className="repository--info-banner--facts">
			{facts.map((f,i) =>
				<div key={i} className="repository--info-banner--facts--fact">
					<div className="repository--info-banner--facts--fact--title">{f.title}</div>
					<div className="repository--info-banner--facts--fact--value">{f.value}</div>
				</div>
			)}
		</div>
	)
}

const RepositoryFactBanner = (props) =>
	<div className="repository--section-wrapper--full-width repository--section-wrapper--grey">
		<section className="repository--title-banner repository--info-banner">
			<h1 className="repository--title-banner--title">{props.title}</h1>
			{renderFacts(props.facts)}
		</section>
	</div>

module.exports = RepositoryFactBanner

