require('./repository-banner.scss')

const React = require('react')

const RepositoryFactBanner = props => (
	<div
		className={`repository--section-wrapper--full-width repository--section-wrapper--grey ${props.className}`}
	>
		<div className="repository--section-wrapper--full-width-bg"></div>
		<section className="repository--title-banner repository--info-banner">
			{props.children}
			<h1 className="repository--title-banner--title" data-title={props.title}>
				{props.title}
			</h1>
		</section>
	</div>
)

module.exports = RepositoryFactBanner
