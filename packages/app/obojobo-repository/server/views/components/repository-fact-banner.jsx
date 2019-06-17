const React = require('react')


const renderFacts = facts => {
	if(!facts) return null
	return [
		<div class="repository--info-banner--facts">,
		{facts.map(f =>
			<div class="repository--info-banner--facts--fact">
				<div class="repository--info-banner--facts--fact--title">{f.title}</div>
				<div class="repository--info-banner--facts--fact--value">{f.value}</div>
			</div>
		)},
		</div>
	]
}

const RepositoryFactBanner = (props) =>
	<div class="repository--section-wrapper--full-width repository--section-wrapper--grey">
		<section class="repository--title-banner repository--info-banner">
			<h1 class="repository--title-banner--title">{props.title}</h1>
			{renderFacts(props.facts)}
		</section>
	</div>

module.exports = RepositoryFactBanner

