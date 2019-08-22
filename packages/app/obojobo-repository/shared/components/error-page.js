const React = require('react');
import DefaultLayout from '../../shared/components/layouts/default'
import RepositoryNav from '../../shared/components/repository-nav'
import RepositoryBanner from '../../shared/components/repository-banner'

const ErrorPage = props =>
	<DefaultLayout title={props.title} className="repository--library">
		<RepositoryNav
			userId={props.currentUser.id}
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

	</DefaultLayout>

module.exports = ErrorPage;
