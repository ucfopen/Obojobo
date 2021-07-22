const React = require('react')
import LayoutDefault from '../layouts/default'
import RepositoryNav from '../repository-nav'
import RepositoryBanner from '../repository-banner'

const PageError = props => (
	<LayoutDefault title={props.title} className="repository--library" appCSSUrl={props.appCSSUrl}>
		<RepositoryNav
			userId={props.currentUser.id}
			userPerms={props.currentUser.perms}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
		/>
		<RepositoryBanner className="default-bg" title={props.title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>{props.children}</p>
			</section>
		</div>
	</LayoutDefault>
)

module.exports = PageError
