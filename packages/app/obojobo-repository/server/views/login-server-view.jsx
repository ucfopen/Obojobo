const React = require('react');
import DefaultLayout from '../../shared/components/layouts/default'
import RepositoryNav from '../../shared/components/repository-nav'
import RepositoryBanner from '../../shared/components/repository-banner'
import Module from '../../shared/components/module'
import Button from '../../shared/components/button'

const title = 'Log in to ObojoboNext'

const LoginPage = (props) =>
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
				<p>There is currently no way to log in directly, though that will likely change in the future.</p>
			</section>
		</div>

	</DefaultLayout>

module.exports = LoginPage;
