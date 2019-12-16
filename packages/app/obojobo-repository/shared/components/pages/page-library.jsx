const React = require('react');
import LayoutDefault from '../layouts/default'
import RepositoryNav from '../repository-nav'
import RepositoryBanner from '../repository-banner'
import Module from '../module'
import Button from '../button'

const title = 'Module Library'

const PageLibrary = props => (
	<LayoutDefault
		title={title}
		className="repository--library"
		appCSSUrl={props.appCSSUrl/* provided by resp.render() */}>
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
		/>
		<RepositoryBanner className="default-bg" title={title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>Find modules for your course.</p>
				{props.collections.map(collection => (
					<span key={collection.id}>
						<div className="repository--main-content--title">
							<span>{collection.title}</span>
						</div>
						<div className="repository--item-list--collection">
							<div className="repository--item-list--collection--item-wrapper">
								<div className="repository--item-list--row">
									<div className="repository--item-list--collection--item--multi-wrapper">
										{collection.drafts.map(draft => (
											<Module key={draft.draftId} {...draft}></Module>
										))}
									</div>
								</div>
							</div>
						</div>
					</span>
				))}
			</section>
		</div>
	</LayoutDefault>
)

module.exports = PageLibrary
