const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './repository-nav'
import RepositoryBanner from './repository-banner'

const title = 'Log in to ObojoboNext'

const PageLogin = (props) =>
	<DefaultLayout title={title} className="repository--library">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
			/>
		<RepositoryBanner className="default-bg" title={title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>To log in, you must access ObojoboNext from <b>within your course</b>.</p>
			</section>
		</div>

	</DefaultLayout>

module.exports = PageLogin;
