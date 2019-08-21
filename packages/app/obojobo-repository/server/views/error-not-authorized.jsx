const React = require('react');
import DefaultLayout from '../../shared/components/layouts/default'
import RepositoryNav from '../../shared/components/repository-nav'
import RepositoryBanner from '../../shared/components/repository-banner'
import Module from '../../shared/components/module'
import Button from '../../shared/components/button'

const title = 'Module Library'

const Library = props =>
	<DefaultLayout title="Not Authorized" className="repository--library">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
			/>
		<RepositoryBanner className="default-bg" title="Not Authorized" />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>You do not have the permissions required to view this page.</p>
			</section>
		</div>

	</DefaultLayout>

module.exports = Library;
