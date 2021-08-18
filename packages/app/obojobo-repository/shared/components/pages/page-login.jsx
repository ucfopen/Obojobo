const React = require('react')
import LayoutDefault from '../layouts/default'
import RepositoryNav from '../repository-nav'
import RepositoryBanner from '../repository-banner'

const title = 'Log in to ObojoboNext'

const PageLogin = props => (
	<LayoutDefault title={title} className="repository--library" appCSSUrl={props.appCSSUrl}>
		<RepositoryNav
			userId={props.currentUser.id}
			userPerms={props.currentUser.perms}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
		/>
		<RepositoryBanner className="default-bg" title={title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>
					To log in, you must access ObojoboNext from <b>within your course</b>.
				</p>
			</section>
		</div>
	</LayoutDefault>
)

module.exports = PageLogin
